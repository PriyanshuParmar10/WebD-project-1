const Listing=require("./model/listing.js");
const Review=require("./model/review.js");
const ExpressError=require("./utils/ExpressError.js");
const{listingSchema,reviewSchema}=require("./schema.js");


module.exports.isLoggedIn=(req,res,next)=>{

    // console.log(req.originalUrl);

    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl; //to have access every where in modules when user click on any page and after logging in it will be redirect to that page
        req.flash("error","you must be loggedin to create listing!!");
        return res.redirect("/login")
    }
    next();
};


// because bydefault passport clears all sesions when someone is logged in 
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; 
        // console.log(res.locals.redirectUrl); 
    }
    next();
};


module.exports.isOwner= async(req,res,next)=>{
    let{id}=req.params;
    let listening=await Listing.findById(id);
    if(!listening.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
};



// to validate listing
module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    // console.log(result.error);
    if(error){
        let errMsg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }

};


// Middleware to validate reviews
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(400, errMsg);
    }
    next();
};


// isAuthor for deleteing reviews
module.exports.isReviewAuthor=async(req,res,next)=>{
    let{id,reviewid}=req.params;
    let review=await Review.findById(reviewid);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the Author of this review!!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};