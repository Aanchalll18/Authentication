import mongoose from 'mongoose'

const connectDb=async(req,res)=>{
    mongoose.connection.on('connected',()=>{
        console.log("DB CONNECTED!!")
    })
    await mongoose.connect(`${process.env.MONGODB_URI}/Auth`);
}

export default connectDb;