const User = require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};


module.exports.Signup=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }else{
            req.flash("success","Welcome to Wanderlust!");
            res.redirect("/listings");
        }
    })
    
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs")
};

module.exports.Login=async (req, res) => {
    req.flash("success", "Welcome to Wanderlust! You are logged in!");
    res.redirect(res.locals.redirectUrl || "/listings");  // ← use res.locals, with fallback
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }else{
            req.flash("success","You are Logged Out");
            res.redirect("/listings");
        }
    })
}