import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { User } from '../models/User.js'
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto"




export const register = catchAsyncError(async (req, res, next) => {

    const { name, email, password } = req.body;
    //const file = req.file;

    if (!name || !email || !password)
        return next(new ErrorHandler("Please enter all Fields", 400))

    let user = await User.findOne({ email });

    if (user) return next(new ErrorHandler("User Already Exist", 409));

    //upload file on cloudinary

    user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: 'tempurl',
            url: 'tempurl',
        },
    })

    sendToken(res, user, "Registered Successfully", 201)
})



export const login = catchAsyncError(async (req, res, next) => {

    const { email, password } = req.body;
    //const file = req.file;

    if (!email || !password)
        return next(new ErrorHandler("Please enter all Fields", 400))

    const user = await User.findOne({ email }).select("+password");

    if (!user) return next(new ErrorHandler("Incorrect Email or Password", 401));

    //upload file on cloudinary

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return next(new ErrorHandler("Incorrect Email or Password", 401));


    sendToken(res, user, `Welcome back ${user.name}`, 200)
})



export const logout = catchAsyncError(async (req, res, next) => {
    res.status(200).cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
    }).json({
        success: true,
        message: "Logged out successfully",
    })
})



export const getMyProfile = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.user._id);

    res.status(200).json({
        success: true,
        user,
    })
})


export const changePassword = catchAsyncError(async (req, res, next) => {

    const { oldPassword, newPassword } = req.body

    if (!oldPassword || !newPassword)
        return next(new ErrorHandler("Please enter all field", 400))


    const user = await User.findById(req.user._id).select("+password")

    const isMatch = await user.comparePassword(oldPassword)

    if (!isMatch)
        return next(new ErrorHandler("Incorrect Old Password", 400))

    user.password = newPassword


    await user.save();

    res.status(200).json({
        success: true,
        message: "Password Changed Successfully",
    })
})



export const updateProfile = catchAsyncError(async (req, res, next) => {

    const { name, email } = req.body



    const user = await User.findById(req.user._id)

    if (name) user.name = name
    if (email) user.email = email




    await user.save();

    res.status(200).json({
        success: true,
        message: "Profile Updated Successfully",
    })
})



export const updateProfilePicture = catchAsyncError(async (req, res, next) => {
    //Cloudinary :todo



    res.status(200).json({
        success: true,
        message: "Profile Picture Updated Successfully"
    })
})



export const forgetPassword = catchAsyncError(async (req, res, next) => {

    const { email } = req.body;

    const user = await User.findOne({ email })


    if (!user) return next(new ErrorHandler("User Not Found",400))

    const resetToken = await user.getResetToken()

   

    //http://localhost:3000/resetpassword/fsdcsdcsccsdcdrfrffsw

    const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`
    const message = `Click on the link to reset your password. ${url}. If you have not requested then please ignore.`



    //Send token via email
    await sendEmail(user.email,"Anifo Reset Password",message)




    res.status(200).json({
        success: true,
        message: `Reset token has been sent to ${user.email}`,
    })
})




export const resetPassword = catchAsyncError(async (req, res, next) => {


    const {token} = req.params;

    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{
            $gt: Date.now(),
        },

    })

    if(!user)
        return next(new ErrorHandler("Token is invalid or has been expired",401))

        user.password = req.body.password;

        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;

        await user.save()
       



    res.status(200).json({
        success: true,
        message: "Password Updated Successfully",
    })
})