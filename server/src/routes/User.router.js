import express from 'express';
import { getAllUsers, loginUser, refreshAccessToken, registerUser, verifyToken } from '../controllers/User.controller.js';

const router = express.Router();

// Register User
router.post('/',registerUser);

// Get all Users
router.get('/', getAllUsers);

// Login User
router.route('/login').post(loginUser);

// RefreshToken
router.route('/refresh-token').post(refreshAccessToken)

// VerifyToken
router.route('/verify-token').get(verifyToken);

export default router;