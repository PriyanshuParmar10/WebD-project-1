const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const { required, types } = require("joi");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        url:String,
        filename:String
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:{
    type:String,
    required:true
    },
    reviews:[
        {
        type:Schema.Types.ObjectId,
        ref:"Review"
        }, 
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
        type:{
            type:String,
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    category:{
        type:String,
        enum:["Rooms","Iconic Cities","Mountains","Castles","Amazing Pools","Camping","Farms","Arctic","Games","Beach Front"],
        required:true
    }
});


listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});


const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;