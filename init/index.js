const mongoose=require("mongoose");
const fakedata=require("./data.js");
const Listing=require("../model/listing.js");

const mongo_url="mongodb://127.0.0.1:27017/WanderLust";

main().then(()=>{
    console.log("Connection sucessful");
})
.catch(err=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(mongo_url);
}

const initDB=async ()=>{
    await Listing.deleteMany({});
    let hello =fakedata.map(obj=>({...obj,owner:'6749b51f7d22629078664a69'}));
    await Listing.insertMany(hello);
    console.log("data was initialised");
}

initDB();