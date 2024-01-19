const ErrorMiddleware = (err,req,res,next)=>{ //err is the error object that we pass in next() function in catchAsyncError function in catchAsyncError.js file
    err.statusCode = err.statusCode||500;

    err.message = err.message||'Internal Server Error'

    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })

}


export default ErrorMiddleware;