const express=require("express");
const router=express.Router();
const {listingSchema,reviewSchema}=require("../schema.js");
const ExpressError=require("../init/utils/ExpressError.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const {isLoggedIn}=require("../middleware.js");
const { isOwner } = require("../middleware.js");
const multer=require('multer');
const {storage}=require("../cloudConfig.js")
const upload=multer({storage})
const listingController=require("../controller/listings.js")

// FIX: wrapAsync was never defined in this file
const wrapAsync=(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    };
};

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

// FIX: validateReview was defined in app.js but used here — moved to this file
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(upload.single('image'), validateListing, isLoggedIn, wrapAsync(listingController.createListing));

//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('image'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));



//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));



module.exports=router;