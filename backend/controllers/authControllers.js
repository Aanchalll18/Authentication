import User from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register=async(req,res)=>{
    const {email,name,password}=req.body;
    if(!email || !password || !name){
        return res.json({
            success:false,
            message:"All fields are mondatory"
        })
    }
    try {
        const existingUser=await User.find({email});
        if(existingUser){
            return res.json({
                success:false,
                message:"User Already exists"
            })
        }
       const hashedPassword=await bcrypt.hash(password,10);
       const user =new User({name,email,password:hashedPassword})
       await user.save()

       const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})

       res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:process.env.NODE_ENV==='production'?'None':'Strict',
        maxAge:7*24*60*60*1000
       })
       res.json({success:true})
    } catch (error) {
        console.log(error.message);
        return res.json({
            success:false,
            message:error.message
        })
    }
};

export const Login=async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.json({
            success:false,
            message:"All fields are mondatory"
        })
    }
    try {
        const user=await User.findOne({email})

        if(!user){
            return res.json({
                success:false,
                message:"User Not found"
            })
        }
        const hash=await bcrypt.compare(password,User.password);
        if(!hash){
            return res.json({
                success:false,
                message:"Incorrent Credentials"
            })
        }
       const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})

       res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        sameSite:process.env.NODE_ENV==='production' ? 'None' : 'Strict',
        maxAge:7*24*60*60*1000
       });
       return res.json({success:true,})
    } catch (error) {
        return res.json({
            success:false,
            message:error.message
        })
    }
};

export const logout=async(req,res)=>{
    try {
        res.clearCppkoie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production' ? 'None' : 'Strict',

        })
        res.json({
            success:true,
            message:"Logged Out!"
        })
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:error.message
        })
    }
}