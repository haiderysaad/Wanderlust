if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodoverride=require("method-override");
const ejsmate=require("ejs-mate");
const ExpressError=require("./init/utils/ExpressError.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const session=require("express-session");
const MongoStore = require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User=require("./models/user.js");
const userRouter = require("./routes/user.js");

const dbUrl=process.env.ATLASDB_URL;

main().then(()=>{console.log("connected to DB")}).catch(err => console.log(err));

async function main(){
    await mongoose.connect(dbUrl);
};

app.engine('ejs',ejsmate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error",(err)=>{
    console.log("ERROR in MONGO SESSION STORE",err)
});

const sessionoptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};

app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.currentUser = req.user;
    console.log("MIDDLEWARE HIT, currentUser =", req.user); // temp
    next();
});


app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",userRouter);

app.all("*path",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("listings/error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("server is listening");
});