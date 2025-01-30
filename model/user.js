const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const passportLocalMongoose=require("passport-local-mongoose");


const userSchema=new Schema({
    email:{
        type:String,
        required:true
    }
});

userSchema.plugin(passportLocalMongoose); //this will automatically add up's username and passwords with salt values
module.exports=mongoose.model("User",userSchema);