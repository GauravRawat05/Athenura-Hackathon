/**
  user.controller.js
  Handles HTTP request/response flow for user.
 */
import User from "../users/user.model.js"
import ApiResponse from "../../utils/ApiResponse.js"
import ApiError from "../../utils/ApiError.js"
import asyncHandler from "../../utils//asyncHandler.js"
import bcrypt from "bcryptjs"
import crypto from "crypto"
// import sendVerificationEmail from "../utils/sendEmail.js"

import {
  admineSecretKey,
  judgeSecretKey,
  universitySecretKey
} from "../../utils/config.js"

import { userRoles } from "./user.constants.js"



const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId)

  const accessToken = user.generateAccessToken()
  const refreshToken = user.generateRefreshToken()

  user.refreshToken = refreshToken
  await user.save({ validateBeforeSave: false })

  return { accessToken, refreshToken }
}


const registerUser = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    password,
    phone,
    dob,
    clgOrUni,
    graduationYear,
    resumeLink,
    secretKey,
    skills
  } = req.body


  if (!fullName || !email || !password) {
    throw new ApiError(400, "Full name, email and password are required")
  }


  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new ApiError(409, "User already exists")
  }


  const userData = {
    fullName,
    email,
    password,
    isEmailVerified: false
  }


  if (phone) userData.phone = phone
  if (dob) userData.dob = dob
  if (clgOrUni) userData.clgOrUni = clgOrUni
  if (graduationYear) userData.graduationYear = graduationYear
  if (resumeLink) userData.resumeLink = resumeLink


  if (skills && skills.length > 0) {
    userData.skills = skills
  } else {
    userData.skills = []
  }


  if (secretKey === admineSecretKey) {
    userData.role = userRoles.ADMIN
  } else if (secretKey === judgeSecretKey) {
    userData.role = userRoles.JUDGE
  } else if (secretKey === universitySecretKey) {
    userData.role = userRoles.UNIVERSITY
  } else {
    userData.role = userRoles.USER
  }

  const user = await User.create(userData)

  const otpData = user.generateTemporaryToken()
  const otp = otpData.unHashedToken.slice(0, 6)

  const hashedOTP = await bcrypt.hash(otp, 10)

  const tokenData = user.generateTemporaryToken()

  user.emailOTP = hashedOTP
  user.emailOTPExpiry = otpData.tokenExpiry
  user.emailVerificationToken = tokenData.hashedToken
  user.emailVerificationTokenExpiry = tokenData.tokenExpiry

  await user.save({ validateBeforeSave: false })


  const createdUser = await User.findById(user._id).select(
    "-password -emailOTP -emailVerificationToken -refreshToken"
  )


  // await sendVerificationEmail({
  //   email: user.email,
  //   otp,
  //   token: tokenData.unHashedToken,
  //   name: user.fullName
  // })

  // 🧪 Dev logs (remove in production)
  console.log("OTP:", otp)
  console.log("Token:", tokenData.unHashedToken)

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"))
})



const verifyAccount = asyncHandler(async (req, res) => {
  const { email, otp, token } = req.body

  const user = await User.findOne({ email })
  if (!user) throw new ApiError(404, "User not found")

  if (user.isEmailVerified) {
    throw new ApiError(400, "Already verified")
  }


  if (!user.emailOTPExpiry || user.emailOTPExpiry < Date.now()) {
    throw new ApiError(400, "OTP expired")
  }

  const isOTPValid = await bcrypt.compare(otp, user.emailOTP)
  if (!isOTPValid) {
    throw new ApiError(400, "Invalid OTP")
  }


  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex")

  if (hashedToken !== user.emailVerificationToken) {
    throw new ApiError(400, "Invalid Token")
  }

  user.isEmailVerified = true
  user.emailOTP = undefined
  user.emailOTPExpiry = undefined
  user.emailVerificationToken = undefined
  user.emailVerificationTokenExpiry = undefined

  await user.save({ validateBeforeSave: false })

  return res.status(200).json(new ApiResponse(200, {}, "Verified"))
})



const loginUser = asyncHandler(async (req, res) => {
  const { email, phone, password } = req.body

  if (!email || !password) {
    throw new ApiError(400, "Email and password required")
  }

  const user = await User.findOne({
      $or : [ {email}, { phone } ]
   })

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  if (!user.isEmailVerified) {
    throw new ApiError(
      403,
      "Please verify your email first. Check inbox or resend OTP"
    )
  }

  const isPasswordValid = await user.isPasswordCorrect(password)
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials")
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user._id)

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailOTP -emailVerificationToken"
  )

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    )
})



const reverifyUser = asyncHandler(async (req, res) => {
  const { email } = req.body
  if (!email) throw new ApiError(400, "Email required")

  const user = await User.findOne({ email })
  if (!user) throw new ApiError(404, "User not found")

  if (user.isEmailVerified) {
    throw new ApiError(400, "User already verified")
  }

  const plainOTP = Math.floor(100000 + Math.random() * 900000).toString()
  const hashedOTP = await bcrypt.hash(plainOTP, 10)

  const tokenData = user.generateTemporaryToken()

  user.emailOTP = hashedOTP
  user.emailOTPExpiry = Date.now() + 10 * 60 * 1000
  user.emailVerificationToken = tokenData.hashedToken
  user.emailVerificationTokenExpiry = tokenData.tokenExpiry

  await user.save({ validateBeforeSave: false })

  // await sendVerificationEmail({
  //   email: user.email,
  //   otp: plainOTP,
  //   token: tokenData.unHashedToken,
  //   name: user.fullName
  // })

   console.log({
    email: user.email,
    otp: otp,
    token: tokenData.unHashedToken,
    name: user.fullName
  })

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "New OTP and verification link sent to email")
    )
})



const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  )

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"))
})


const getMe = asyncHandler(async (req, res) => {
  const userId = req.user?._id

  if (!userId) {
    throw new ApiError(401, "Unauthorized")
  }

  const user = await User.findById(userId).select(
    "-password -refreshToken -emailOTP -emailVerificationToken"
  )

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  return res.status(200).json(
    new ApiResponse(200, user, "User fetched successfully")
  )
})

export {
  registerUser,
  verifyAccount,
  reverifyUser,
  loginUser,
  logoutUser,
  getMe
}