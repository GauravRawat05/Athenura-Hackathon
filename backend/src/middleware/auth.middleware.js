/**
 *   auth.middleware.js
 *   Global authentication guard that extracts the bearer token, verifies it, and attaches the authenticated user context to the request.
 *  */
//jwt is used to verify the token
import User from "../modules/users/user.model.js"
import ApiError from "../libs/apiError.js"
import jwt from "jsonwebtoken"
import envConfig from "../config/envConfig.js"
import asyncHandler from '../libs/asyncHandler.js';
import { userRoles } from "../modules/users/user.constants.js"

export const verifyJWT = asyncHandler(async (req, res, next) => {

  console.log(req.cookies);


  const authHeader = req.header("Authorization")
  const token =
    req.cookies?.accessToken ||
    (authHeader?.startsWith("Bearer") ? authHeader.substring(6).trim() : null)

  if (!token) {
    throw new ApiError(401, "Unauthorized request")
  }

  const decodedToken = jwt.verify(token, envConfig.accessTokenSecret)

  const user = await User.findById(decodedToken._id).select(
    "-password -refreshToken"
  )
  console.log("Found user in DB:", { id: user._id, role: user.role });


  if (!user) {
    throw new ApiError(401, "Invalid access token")
  }

  if (user.isSuspended) {
    throw new ApiError(403, "User account has been suspended")
  }

  req.user = user
  next()
})

export const verifyAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }

  if (req.user.role !== userRoles.ADMIN) {
    throw new ApiError(403, "Only admin can perform this action");
  }

  next();
});

// Judge access guard — used by admin panel routes that should be readable by judges
export const verifyJudge = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Authentication required");
  }

  if (req.user.role !== userRoles.JUDGE) {
    throw new ApiError(403, "Only judges can perform this action");
  }

  next();
});