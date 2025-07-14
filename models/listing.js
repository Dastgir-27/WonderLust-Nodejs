const mongoose = require("mongoose");
const Review = require("./review.js");

let listSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        filename: String, 
        url: String,
    },
    price: Number,
    location: String,
    country: String, 
    Reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    categories: {
        type: String,
        enum: ["Trending","Rooms","Iconic Cities","Mountians","Castles","Amazing Pools","Camping","Farms","Arctic","Domes","Boats"],
    },
    geometry:   {
    type: {
      type: String, 
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});

listSchema.post("findOneAndDelete",async (listing) =>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.Reviews}});
    }
});

let Listing = mongoose.model("Listing",listSchema);
module.exports = Listing; 