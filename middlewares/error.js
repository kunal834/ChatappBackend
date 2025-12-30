export const errormiddleware = (err,req,res,next) =>{
    err.message = err.message || "internal server error"
    err.statuscode = err.statuscode || 500
   
    // If headers are already sent, let Express default handler handle it.
    // This prevents the "ERR_HTTP_HEADERS_SENT" crash.
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.statuscode).json({
        success: false,
        message: err.message
    })
}