/**
  user.model.js
  Defines the Mongoose schema and model for user records.
 */
import mongoose from "mongoose";
import { userRoles, userRolesEnums } from "./user.constants.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import envConfig from "../../config/envConfig.js";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is required"],
    },
    email: {
      type :  String,
      required: [true, "Email is required"],
      lowercase: true,
      match : [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Email format is incorrect. Use a valid format such as name@example.com (e.g., jane.smith@gmail.com) .",
      ],
      unique:true
    },
    password : {
      type : String,
      required : [true, "Password is required"],
    },
    phone:{
      type : Number,
      required : [true, "Phone no. is required"],
      unique : true
    },
    dateOfBirth : {
      type : Date,
      required : [true,"Date of Birth is required"]
    },
    collegeOrUniversity : {
      type : String,
      required : [true,"College or University is required"]
    },
    graduationYear : {
      type : Number,
      required : [true,"Graduation Year is required"]
    },
    skills : {
      type : [String],
      default : [],
    } ,
    resumeLink : {
      type : String
    },
    gender:{
      type : String,
      enum : ["Male", "Female", "Other"],
      default : "Other",
      required : [true,"Gender is required"]
    },
    role : {
      type : String,
      enums : userRolesEnums,
      default : userRoles.USER
    },
    refreshToken : {
      type : String,
      default : ""
    },
    isSuspended : {
      type : Boolean,
      default : false
    },
    isEmailVerified : {
      type : Boolean,
      default : false
    },
    emailOTP : {
      type : String,
    },
    emailOTPExpiry : {
      type : Date
    },
    resetPasswordToken : {
      type : String,
    },
    resetPasswordTokenExpiry : {
      type : Date
    }
  },
  {
    timestamps: true,
  },
);


userSchema.pre("save", async function() {
    if(!this.isModified("password")) return ;
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect =async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function() {
   return jwt.sign({
      _id : this._id,
      fullName : this.fullName,
      email : this.email,
      role : this.role
    }, envConfig.accessTokenSecret, {
    expiresIn : envConfig.accessTokenExpiry
   })
}

userSchema.methods.generateRefreshToken = function() {
   return jwt.sign({
      _id : this._id
    }, envConfig.refreshTokenSecret, {
    expiresIn : envConfig.refreshTokenExpiry
   })
}

const User = mongoose.model("User",userSchema)
export default User;