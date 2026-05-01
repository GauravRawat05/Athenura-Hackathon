/**
  auth.routes.js
  Defines Express routes for the auth domain.
 */
import { Router } from "express"
import {getMe, loginUser, logoutUser, registerUser, reverifyUser, verifyAccount} from '../../modules/users/user.controller.js'
import { verifyJWT } from '../../middleware/auth.middleware.js'

const router = Router()

router.route("/register").post(registerUser)
router.route("/verify-account").post(verifyAccount)
router.route("/login").post(loginUser)
router.route("/reverify").post(reverifyUser)
router.route("/me").get(verifyJWT,getMe)
router.route("/logout").post(verifyJWT, logoutUser)


export default router;