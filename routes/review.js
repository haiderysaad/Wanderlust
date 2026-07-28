const express=require("express");
const router=express.Router({mergeParams:true});
const {reviewSchema}=require("../schema.js");
const ExpressError=require("../init/utils/ExpressError.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const { validateReview } = require("../middleware.js");
const {isLoggedIn}=require("../middleware.js");
const { isReviewAuthor } = require("../middleware.js");

const wrapAsync=(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    };
};

const reviewController=require("../controller/reviews.js");



// FIX: was "/" — needs no extra path since mounted at "/:id/reviews" in app.js
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

// FIX: was "/:reviewId" — id was never in path so always undefined
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));


module.exports=router;