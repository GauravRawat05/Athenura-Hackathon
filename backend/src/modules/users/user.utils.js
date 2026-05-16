//user.utils.js - Helper utilities for user module.

import bcrypt from "bcryptjs"
import crypto from "crypto"
import envConfig from "../../config/envConfig.js"
import { userRoles } from "./user.constants.js"

class UserUtils {
  
  // Determine user role based on secret key
  
  determineUserRole(secretKey) {
    if (secretKey === envConfig.admineSecretKey) {
      return userRoles.ADMIN
    } else if (secretKey === envConfig.judgeSecretKey) {
      return userRoles.JUDGE
    } else if (secretKey === envConfig.universitySecretKey) {
      return userRoles.UNIVERSITY
    } else {
      return userRoles.USER
    }
  }

  
  //Hash OTP with bcrypt
  
  async hashOTP(otp, saltRounds = 10) {
    return await bcrypt.hash(otp, saltRounds)
  }

  //Compare OTP with hashed OTP
  async compareOTP(plainOTP, hashedOTP) {
    return await bcrypt.compare(plainOTP, hashedOTP)
  }

  //Generate 6-digit OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  //Get OTP expiry time (10 minutes from now)
  getOTPExpiryTime() {
    return new Date(Date.now() + 10 * 60 * 1000)
  }

  //Get user fields to exclude from response
  getSensitiveFieldsToExclude() {
    return "-password -emailOTP -refreshToken -resetPasswordToken -resetPasswordTokenExpiry -emailOTPExpiry -emailVerificationToken -emailVerificationTokenExpiry"
  }

  //Generate reset token
  generateResetToken() {
    return crypto.randomBytes(32).toString('hex')
  }

  //Hash token
  async hashToken(token) {
    return await bcrypt.hash(token, 10)
  }

  //Get reset token expiry time (1 hour from now)
  getResetTokenExpiryTime() {
    return Date.now() + 60 * 60 * 1000
  }

  //Build user data object for registration
  buildUserData({
    fullName,
    email,
    password,
    phone,
    dateOfBirth,
    collegeOrUniversity,
    graduationYear,
    resumeLink,
    skills,
    role
  }) {
    const userData = {
      fullName,
      email,
      password,
      isEmailVerified: false,
      role
    }

    if (phone) userData.phone = phone
    if (dateOfBirth) userData.dateOfBirth = dateOfBirth
    if (collegeOrUniversity) userData.collegeOrUniversity = collegeOrUniversity
    if (graduationYear) userData.graduationYear = graduationYear
    if (resumeLink) userData.resumeLink = resumeLink
    if (skills && skills.length > 0) {
      userData.skills = skills
    } else {
      userData.skills = []
    }

    return userData
  }
}

export default UserUtils
