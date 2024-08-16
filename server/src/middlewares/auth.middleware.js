import { User } from "../models/User.model";
import jwt from 'jsonwebtoken';

export const verifyJwt = async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if(!token){
            return res.status(401).send("Invalid crendentials");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            return res.status(401).send("Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        console.log("Error",error);
        res.status(401).json({ message:"Invalid or expired access token" });
    }
}