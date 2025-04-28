import mongoose from "mongoose";
const connectDB =async()=>{
  
try {
    const conectInstance = await mongoose.connect(process.env.DBURL)
    console.log   (`db conected  host : ${conectInstance.connection.host}`)
} catch (error) {
    console.error(`db conaction fail  : ${error}`)
    process.exit(1)
}
}
export default connectDB