import { catchAsyncError } from "../middlewares/catchAsyncError.js"
import { Course } from "../models/Course.js"
import ErrorHandler from "../utils/errorHandler.js";

export const getAllAnimes = catchAsyncError(async (req, res, next) => {
    const animes = await Course.find().select("-lectures");
    res.status(200).json({
        success: true,
        animes,
    })

})


export const createanime = catchAsyncError(async (req, res, next) => {

    const { title, description, category, createdBy } = req.body;

    if (!title || !description || !category || !createdBy)
        return next(new ErrorHandler("Please enter all values", 400)) // ErrorHandler is a custom class created to handle error, it inherits the parent class "Error"

    // const file = req.file;

    await Course.create({
        title, description, category, createdBy,
        poster: {
            public_id: 'temp',
            url: 'temp',
        },
    })



    res.status(201).json({
        success: true,
        message: 'Anime added Successfully. You can add trailers now',
    })

})