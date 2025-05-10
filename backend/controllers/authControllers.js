import User from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import transporter from "../config/nodemailer.js";


export const register = async (req, res) => {
    const { email, name, password } = req.body;
    console.log(email)
    if (!email || !password || !name) {
        return res.status(400).json({
            success: false,
            message: "All fields are mandatory"
        });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

            const mailOptions={
                from:process.env.SENDER_EMAIL,
                to:email,
                Subject:`Welcome to AuthNest`,
                text:`Welcome to AuthNest website.Your account has been created with email id:${email}`
            }
            await transporter.sendMail(mailOptions)

        res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const Login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are mandatory"
        });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const hash = await bcrypt.compare(password, user.password);
        if (!hash) {
            return res.status(401).json({
                success: false,
                message: "Incorrect credentials"
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true, message: "Login successful" });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict'
        });

      return  res.json({
            success: true,
            message: "Logged out!"
        });
    } catch (error) {
        console.log(error);
       return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const sendVerifyOtp=async(req,res)=>{
    try {
        const userId = req.userId;

        console.log(userId)
        const user=await User.findById(userId);
        if(user.isAccountVerified){
            return res.json({
                success:false,
                message:"Account Already Verified"
            })
        }
        const otp=String(Math.floor(100000 + Math.random()*900000));

        user.verifyotp=otp;
        user.verifyOtpExpireAt=Date.now()+24*60*60*1000
        await user.save()

        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:"OTP Verification",
            text:`Your OTP is ${otp}.verify your account using this OTP`
        }
        await transporter.sendMail(mailOptions)

        res.json({
            success:true,
            message:'Verification OTP sent on Email'
        })

    } catch (error) {
       res.json({
        success:false,
        message:error.message
       }) 
    }
};

export const verifyEmail = async (req, res) => {
    try {
      const userId = req.userId;
      const { otp } = req.body;
  
      if (!userId || !otp) {
        return res.json({
          success: false,
          message: "All fields are mandatory!",
        });
      }
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.json({
          success: false,
          message: "User not found",
        });
      }
  
      if (user.verifyotp === "" || user.verifyotp !== otp) {
        return res.json({
          success: false,
          message: "Invalid Otp",
        });
      }
  
      if (user.verifyOtpExpireAt < Date.now()) {
        return res.json({
          success: false,
          message: "Otp Expired!",
        });
      }
  
      user.isAccountVerified = true;
      user.verifyotp = "";
      user.verifyOtpExpireAt = 0;
      await user.save();
  
      return res.json({
        success: true,
        message: "Email verified successfully",
      });
  
    } catch (error) {
      console.log(error);
      return res.json({
        success: false,
        message: error.message,
      });
    }
};
  
export const isAuthenticated=async(req,res)=>{
    try {
        const token = req.cookies.token;
        return res.json({success:true})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
};

export const sendResetOtp=async(req,res)=>{
    try {
        const {email}=req.body;
        if(!email){
            return res.json({
                success:false,
                message:'All fields are required'
            })
        }
        const user=await User.findOne({email})
        if(!user){
            return res.json({
                success:false,
                message:'User Not Found!'
            })
        }
        const otp=String(Math.floor(100000 +Math.random()*900000));
        user.verifyOtp=otp;
        user.resetOtpExpireAt=Date.now()+15*60*60*1000
        await user.save();

        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:'Password Reset Otp',
            text:`Your Otp is ${otp}.Verify your account using this Otp`
        }
        await transporter.sendMail(mailOptions)
        // if(otp==='' || user.otp !== otp){
        //     return res.json({
        //         success:false,
        //         message:'Invalid Credentials'
        //     })
        // }
        return res.json({
            success:true,
            message:'Otp sent successfully!'
        })

    } catch (error) {
        console.log(error)
        return res.json({
            success:false,
            message:'Failed to sent otp'
        })
    }
};



export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newpassword } = req.body;

    if (!email || !otp || !newpassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(410).json({
        success: false,
        message: "OTP Expired!",
      });
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);
    user.password = hashedPassword;
    user.resetOtp = '';
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully!",
    });

  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};


