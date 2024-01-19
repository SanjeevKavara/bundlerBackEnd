import express from "express";
import { changePassword, forgetPassword, getMyProfile, login, logout, register, resetPassword, updateProfile, updateProfilePicture } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.route("/register").post(register)

//Login
router.route("/login").post(login)

//Logout
router.route("/logout").get(logout)

//Get my Profile
router.route("/me").get(isAuthenticated,getMyProfile)



//ChangePassword
router.route("/changepassword").put(isAuthenticated,changePassword)

//UpdateProfile
router.route("/updateprofile").put(isAuthenticated,updateProfile)

//updateProfilePic
router.route("/updateprofilepicture").put(isAuthenticated,updateProfilePicture)



//forgotPassword
router.route("/forgetpassword").post(forgetPassword)

//resetPassword
router.route("/resetpassword/:token").put(resetPassword)

//add to watchlist
//remove from watchlist

export default router;