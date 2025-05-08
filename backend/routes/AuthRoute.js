import express from 'express'
import {  Login, logout, register, sendVerifyOtp,verifyEmail } from '../controllers/authControllers.js';
import uAuth from '../middlewares/Auth.js';

const authUser=express.Router()

authUser.post('/register',register);
authUser.post('/login',Login)
authUser.get('/logout',logout)
authUser.post('/send-verify-otp',uAuth,sendVerifyOtp)
authUser.post('/verify-account',uAuth,verifyEmail)
// authUser.post('/is-auth',uAuth,isAuthenticated);
// authUser.post('/send-otp',sendOtp);

export default authUser;