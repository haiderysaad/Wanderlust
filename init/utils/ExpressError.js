class ExpressError extends Error{
    constructor(statusCode,message){  // FIX: params were StatusCode/Message (wrong casing)
        super();
        this.statusCode=statusCode;   // FIX: was this.StatusCode — app reads err.statusCode
        this.message=message;         // FIX: was this.message=this.message (assigned to itself)
    }
}
module.exports=ExpressError;