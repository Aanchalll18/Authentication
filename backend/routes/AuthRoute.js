import express from 'express'
import { isAuthenticated, Login, logout, register, sendVerifyEmail, sendVerifyOtp, verifyEmail } from '../controllers/authControllers.js';
import uAuth from '../middlewares/Auth.js';

const authUser=express.Router()

authUser.post('/register',register);
authUser.post('/login',Login)
authUser.get('/logout',logout)
authUser.post('/send-verify-email',uAuth,sendVerifyEmail)
authUser.post('/verify-account',uAuth,verifyEmail)
authUser.post('/is-auth',uAuth,isAuthenticated)

export default authUser;