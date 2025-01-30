const Listing=require("../model/listing");
const  OpenCage = require('opencage-api-client');  // Import the OpenCage client



module.exports.index=async(req,res)=>{
    let allListings = await Listing.find();
    res.render("./listings/index.ejs",{allListings});
};

module.exports.renderNewFrom=(req,res)=>{
    res.render("./listings/new.ejs");
};

module.exports.showNewFrom=async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Invalid Listing Request!!");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listing});
};

module.exports.createListing=async(req,res,next)=>{

   let coordinates = await OpenCage.geocode({ q: req.body.listing.location });
   let lat=coordinates.results[0].geometry.lat;
   let lng=coordinates.results[0].geometry.lng;  
   let result={type:"point",coordinates:[lat,lng]};

    let url=req.file.path;
    let filename=req.file.filename;
    // let{title,description,image,price,location,country}=req.body;
    let newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    newListing.geometry=result;
    newListing.category=req.body.listing.category;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};

module.exports.editListingForm=async(req,res)=>{
    let{id}=req.params;
    let detail=await Listing.findById(id);

    if( !detail){
        req.flash("error","Invalid Listing Request!!");
        res.redirect("/listings");
    }

    let originalImageUrl=detail.image.url;
    // console.log(originalImageUrl);
    originalImageUrl= originalImageUrl.replace("/uploads","/uploads/h_300,w_250");
    res.render("./listings/edit.ejs",{detail,originalImageUrl});
};

module.exports.updatedListing=async(req,res)=>{
    let{id}=req.params;
    let listing =await Listing.findByIdAndUpdate(id,{...req.body.listing}); //deconstructing all req.body.listing into individual

    if(typeof req.file !=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }

    req.flash("success","Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully!");
    res.redirect("/listings");
};

module.exports.categoryListing = async (req, res) => {
    // console.log("Category:", req.params.category);  // Log the category param

    let category = req.params.category;

    if (!category || typeof category !== "string") {
        console.log("Invalid category format");
        req.flash("error", "Invalid category format");
        return res.redirect("/listings");
    }

    try {
        let allListings = await Listing.find({ category: category });

        if (allListings.length === 0) {
            req.flash("error", "No listings found in this category");
            return res.redirect("/listings");
        }

        res.render("./listings/index.ejs", { allListings, category });
    } catch (err) {
        console.error("Error fetching listings:", err);
        req.flash("error", "Something went wrong!");
        res.redirect("/listings");
    }
};

module.exports.searchListing = async (req, res) => {
    let { query } = req.query;
    // console.log('Search query:', query);  // Log the search query

    if (!query) {
        res.redirect("/listings");
    }

    let searchResults = await Listing.find({
        $or: [
            { country: { $regex: query, $options: "i" } },
            { location: { $regex: query, $options: "i" } }
        ]
    });

    if(searchResults.length === 0){
        req.flash("error", "No listings found matching your search query"); 
        return res.redirect("/listings");
    }

    // console.log('Search results:', searchResults);  // Log the search results

    res.render("./listings/index.ejs", { allListings: searchResults });
};


