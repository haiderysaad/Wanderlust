const Joi=require('joi');
const categories = require("./init/categories.js");
const listingCategories = categories
    .filter(({ value }) => value !== "trending")
    .map(({ value }) => value);

module.exports.listingSchema=Joi.object({ // FIX: was joi.object (lowercase — ReferenceError)
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        category: Joi.string().valid(...listingCategories).required(),
        price: Joi.number().required().min(0),
        image: Joi.object({          // FIX: was Joi.string() — form sends image as nested object
            url: Joi.string().allow("",null),
            filename: Joi.string().allow("",null)
        }).allow(null)
    }).required()
});

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating: Joi.number().required().min(1).max(5).integer(),
        comment:Joi.string().required()
    })
}).required()