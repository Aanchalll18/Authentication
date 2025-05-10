import express from 'express'
import {  isAuthenticated, Login, logout, register,  resetPassword,  sendResetOtp, sendVerifyOtp,verifyEmail } from '../controllers/authControllers.js';
import uAuth from '../middlewares/Auth.js';

const authUser=express.Router()

authUser.post('/register',register);
authUser.post('/login',Login)
authUser.post('/logout',logout)
authUser.post('/send-verify-otp',uAuth,sendVerifyOtp)
authUser.post('/verify-account',uAuth,verifyEmail)
authUser.get('/is-auth',uAuth,isAuthenticated);
authUser.post('/send-reset-otp',sendResetOtp);
authUser.post('/reset-otp',resetPassword)

export default authUser;