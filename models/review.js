const mongoose = require("mongoose");  
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    author: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    category:{
        type:String,
        enum:["mountains","arctic","farms","deserts"]
    }
});

module.exports = mongoose.model("Review", reviewSchema);