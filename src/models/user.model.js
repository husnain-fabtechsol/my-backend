import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,

    },
    coverimage: {
        type: String,
        
    },
  role: {
    type: String,
    enum: ["U", "AD","RE"],
    default: "user",
  }
  
},
{timestamps:true}
);
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
     return   next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}
userSchema.methods.generateAssignToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
}
const Usermodel = mongoose.model("User", userSchema);

export default Usermodel;