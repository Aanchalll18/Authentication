import express from 'express'
import uAuth from '../middlewares/Auth.js';
import getUserData from '../controllers/userControllers.js'

const userRoute=express.Router();

userRoute.get('/data',uAuth,getUserData)

export default userRoute;