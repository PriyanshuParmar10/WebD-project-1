const User=require("../model/user");


module.exports.signupForm=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup=async(req,res,next)=>{
    try{
    let{username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);

    req.login(registeredUser,(err=>{
        if(err){
        return next(err);
        }
        req.flash("success","Welcome to WanderLust!");
        res.redirect(res.locals.redirectUrl || "/listings");
    }));
    
    }
    catch(err){
        req.flash("error",err.message);
        // console.log(err);
        res.redirect("/signup");
    }
};

module.exports.loginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async (req, res) => {
    req.flash("success", "Welcome back to WanderLust!");

    // Redirect to the saved URL or default to "/listings"
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout=(req,res,next)=>{
    req.logOut(err=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are loggedout now");
        res.redirect("/listings")
    });
};