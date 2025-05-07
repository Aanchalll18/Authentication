import jwt from "jsonwebtoken";

const uAuth=async(req,res,next)=>{
    try {
        const {token}=req.cookies;
        if(!token){
            return res.json({
                success:false,
                message:'Token Not found'
            })
        }
        const decode=await jwt.verify(token,process.env.JWT_SECRET)

        if(decode.id){
            req.body.userId=decode.id
        }else{
            return res.json({
                success:false,
                message:"Not Authorized login again!"
            })
        }
        next()
    } catch (error) {
        return res.json({
            success:false,
            message:'Something went Wrong!'
        })
    }
}

export default uAuth;