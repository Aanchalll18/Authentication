import express from 'express'
import cors from'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import connectDb from './config/db.js';

const app=express();
const port=process.env.PORT || 4000;

app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials:true}))

connectDb();

app.listen(port,()=>console.log(`server started at ${port}`))

app.get("/",(req,res)=>{
    res.send("API WORKING")
})