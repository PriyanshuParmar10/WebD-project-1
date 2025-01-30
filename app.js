if(process.env.NODE_ENV !="production"){

    require("dotenv").config();

}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const mongo_url="mongodb://127.0.0.1:27017/WanderLust";
const db_url=process.env.ATLASDB_URL;
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./model/user.js");


// Routes
const listingRouters=require("./routes/listing.js");
const reviewRouters=require("./routes/review.js");
const userRouters=require("./routes/user.js");

// connection with mongodb
main().then(()=>{
    console.log("Connection sucessful");
})
.catch(err=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(mongo_url);
}


// view engine,url encoding,serving static files and methodOverride
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);


// mongo store for session
const store=MongoStore.create({
    mongoUrl:db_url,
    touchAfter:24*60*60,
    crypto:{
        secret:process.env.SECRETE
    },
    touchAfter:24*60*60
});

store.on("error",(e)=>{
    console.log("Error in MONGO SESSION STORE",e);
}   );

// session options
const sessionOptions={
    store,
    secret:process.env.SECRETE,
    resave:false,
    saveUninitialized:true,
    Cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000, // time for cookie it is 7 days we can add time in mileseconds
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
};


// session and flash are used before routes
// session and flash
app.use(session(sessionOptions));
app.use(flash());

// passport require sessions so we write after session
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// middleware to use flash everywhere
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});


// demo-user route
// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"demo@gmail.com",
//         username:"delta-student"
//     });
//     let registeredUser=await User.register(fakeUser,"helloworld"); //here helloworld is password & register is an static method in password
//     res.send(registeredUser);
// });



// listings routes
app.use("/listings",listingRouters);

// Reviews routes
app.use("/listings/:id/reviews",reviewRouters);

// users routes
app.use("/",userRouters);



// for all route with my domain
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not Found"));
});


// Error handling
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something Went Wrong!"}=err;
    res.status(statusCode).render("error.ejs",{message});
});


app.listen(8080,()=>{
    console.log("app is listening on 8080");
});