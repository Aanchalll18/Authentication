import express from 'express'
import { Login, logout, register } from '../controllers/authControllers.js';

const authUser=express.Router()

authUser.post('/register',register);
authUser.post('/login',Login)
authUser.get('/logout',logout)

export default authUser;