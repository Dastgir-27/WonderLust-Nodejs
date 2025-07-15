const Listing = require("../models/listing.js");

module.exports.index = async(req,res) => {
    let allListing = await Listing.find({});
    res.render("./listing/index.ejs",{allListing});
}

module.exports.newListingForm = (req,res)=>{
    res.render("./listing/new.ejs");
}

module.exports.showListing = async (req,res) => {
    let {id} = req.params;
    let oneListing = await Listing.findById(id).populate({path:"Reviews",populate:{ path: "author"}}).populate("owner");
    if(!oneListing){
        req.flash("error","Listing you requested for does not exists!");
        res.redirect("/listing");
    }
    res.render("./listing/show.ejs",{oneListing});
}

module.exports.addNewListing = async (req,res,next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let lat;
    let lon;
    const geocodingAPI = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(req.body.listing.location)}&format=json`;
    try {
        const res = await fetch(geocodingAPI, {
            headers: {
                "User-Agent": "WonderLust/1.0 (dastgiridrisi27@gmail.com)"
            }
        });
        const data = await res.json();
          if (data.length > 0) {
            lat = data[0].lat;
            lon = data[0].lon;
          } else {
            console.error("Location not found.");
        }   
    } catch (err) {
        console.error("Geocoding failed:", err);
    }
    let newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {filename , url};
    newlisting.geometry.type = "Point";
    newlisting.geometry.coordinates = [lon,lat];

    await newlisting.save();
    req.flash("success", "New listing created!");
    res.redirect("/listing");
}

module.exports.editListingForm = async (req,res) => {
    let {id} = req.params;
    let oneListing = await Listing.findById(id);
      if(!oneListing){
        req.flash("error","Listing you requested for does not exists!");
        res.redirect("/listing");
         }
    let originalImageUrl = oneListing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_200,w_200");
    res.render("./listing/edit.ejs",{oneListing , originalImageUrl});
}

module.exports.updateListing = async (req,res) => {
    if(!req.body.listing){
        throw new expressError(400,"Send valid data for listing!");
    }
    let {id} = req.params;
    let oneListing = await Listing.findById(id);
    
    let updatedListing = await Listing.findByIdAndUpdate(id,{ ...req.body.listing }); 
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = {filename , url};
        await updatedListing.save();
    }
    if(oneListing.location !== req.body.listing.location){
        let lat;
        let lon;
        const geocodingAPI = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(req.body.listing.location)}&format=json`;
        try {
            const res = await fetch(geocodingAPI, {
            headers: {
                "User-Agent": "WonderLust/1.0 (dastgiridrisi27@gmail.com)"
            }
            });
            const data = await res.json();
            if (data.length > 0) {
                lat = data[0].lat;
                lon = data[0].lon;
            } else {
                console.error("Location not found.");
            }   
        } catch (err) {
            console.error("Geocoding failed:", err);
        }
        updatedListing.geometry.coordinates = [lon,lat];
        await updatedListing.save();
    }
   
    req.flash("success", "Listing Updated!");
    res.redirect(`/listing/${id}`);
}

module.exports.destroyListing = async (req,res) => {
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listing");
}