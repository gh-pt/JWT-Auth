import { User } from "../models/User.model.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";

// Generate Access and Refresh Tokens
const generateTokens = async (user) => {
    const _id = user._id;
    const accessToken = jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
    const refreshToken = jwt.sign({ _id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });

    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
};

// Options of Cookies
const cookieOptions = {
    httpOnly: true,
    secure: true,
};

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        console.log("request coming");
        const users = await User.find().select("-password");
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Register User
export const registerUser = async (req, res) => {
    try {
        const { username, email, password, avatar } = req.body;

        // check the any field is empty
        if (
            [username, email, password, avatar].some((field) => field?.trim() === "")
        ) {
            return res.status(409).send("All filed ar required");
        }

        // check the existed user
        const existedUser = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (existedUser) {
            return res.status(409).send("User with email or username already exists");
        }

        // generate hassedPassword
        const hassedPassword = await bcrypt.hash(password, 10);

        // create user
        const user = new User({
            username,
            email,
            password: hassedPassword,
            avatar,
        });

        // Generate the accessToken and refreshToken
        const { accessToken, refreshToken } = await generateTokens(user);

        // send the response and cookies
        res
            .status(201)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .send({
                message: "User Registered Successfully",
                user: { ...user.toObject(), password: undefined },
            });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
};

// login user
export const loginUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // check for the fields
        if (!username && !email) {
            return res.status(400).send("Username or email is required!");
        }
        // find the user
        const user = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (!user) {
            return res.status(404).send("User not found");
        }

        // Validate the password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send({ message: "Invalid credentials" });
        }

        // generate the Tokens
        const { accessToken, refreshToken } = await generateTokens(user);

        const loggedInUser = await User.findById(user._id).select(
            "-password -refreshToken"
        );

        res
            .status(201)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json({
                user: loggedInUser,
                accessToken,
                refreshToken,
                status: "User Successfully loggedIn",
            });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
};

// Refresh Token
export const refreshAccessToken = async (req, res) => {
    try {
        const incomingRefreshToken =
            req.cookies.refreshToken || req.body.refreshToken;

        if (!incomingRefreshToken) {
            return res.status(401).send("Unauthorized request");
        }

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            return res.status(401).send("Invalid refresh Token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            return res.status(401).send("Refresh token is expired or used");
        }

        const { accessToken, refreshToken } = await generateTokens(user);

        // user.refreshToken = newRefreshToken;
        // await user.save();

        // send the response
        res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .send({
                message: "Access Token Refreshed",
                accessToken,
                refreshToken,
            });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send(error);
    }
};

// Verify token
export const verifyToken = async (req, res) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");
        // console.log("Token: "+token);

        if (!token) {
            return res.status(401).send("Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // console.log("decoded: "+ decodedToken._id);

        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );

        if (!user) {
            return res.status(401).send("Invalid Access Token");
        }

        res.status(200).json({ message: "Valid User", User: user });
    } catch (error) {
        console.log("Error:", error);
        res.status(401).json({ message: "Invalid or expired access token" });
    }
};
