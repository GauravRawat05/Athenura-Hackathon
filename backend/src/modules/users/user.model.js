/**
  user.model.js
  Defines the Mongoose schema and model for user records.
 */
import mongoose from "mongoose";
import { userRoles, userRolesEnums } from "./user.constants.js";
import bcrypt from "bcryptjs";
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { accessTokenExpiry, accessTokenSecret, refreshTokenExpiry, refreshTokenSecret } from "../../utils/config.js";

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
    dob : {
      type : Date,
      required : [true,"Date of Birth is required"]
    },
    clgOrUni : {
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
    role : {
      type : String,
      enums : userRolesEnums,
      default : userRoles.USER
    },
    refreshToken : {
      type : String,
      default : ""
    },
    isEmailVerified : {
      type : Boolean,
      default : false
    },
    emailVerificationToken : {
      type : String
    },
    emailVerificationTokenExpiry : {
      type : Date
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
    }, accessTokenSecret, {
    expiresIn : accessTokenExpiry
   })
}

userSchema.methods.generateRefreshToken = function() {
   return jwt.sign({
      _id : this._id
    }, refreshTokenSecret, {
    expiresIn :  refreshTokenExpiry
   })
}

userSchema.methods.generateTemporaryToken = function () {
  const unHashedToken = crypto.randomBytes(20).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");

  const tokenExpiry = Date.now() + 10 * 60 * 1000;

  return {
    unHashedToken,
    hashedToken,
    tokenExpiry,
  };
};

const User = mongoose.model("User",userSchema)
export default User;