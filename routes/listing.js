const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const User = require('../models/user.js');
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage});
const { sendOwnerEmail, sendGuestConfirmation } = require("../utils/email.js");


router.route("/")   
.get(wrapAsync(listingController.index)) //index route
.post(isLoggedIn,upload.single("listing[image]"), validateListing, wrapAsync(listingController.addNewListing)); //add route


//new route     Note: new route should be above show route beacuse it is converting new to id.
router.get("/new",isLoggedIn,listingController.newListingForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing)) //show route
.put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing,wrapAsync(listingController.updateListing)) //update route
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)); //delete route

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListingForm));

// Booking Inquiry Route
router.post("/:id/book", isLoggedIn, wrapAsync(async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, guests } = req.body;

        // Fetch listing with owner details
        const listing = await Listing.findById(id).populate('owner');
        
        if (!listing) {
            req.flash('error', 'Listing not found');
            return res.redirect('/listing');
        }

        // Prepare booking details object
        const bookingDetails = {
            listingTitle: listing.title,
            listingLocation: `${listing.location}, ${listing.country}`,
            listingPrice: listing.price,
            guestName: name,
            guestEmail: email,
            guestPhone: phone,
            numberOfGuests: guests
        };

        // Send emails
        await Promise.all([
            sendOwnerEmail(listing.owner.email, bookingDetails),
            sendGuestConfirmation(email, bookingDetails)
        ]);

        req.flash('success', 'Booking inquiry sent successfully! Check your email for confirmation.');
        res.redirect(`/listing/${id}`);

    } catch (error) {
        console.error('Email sending error:', error);
        req.flash('error', 'Failed to send booking inquiry. Please try again.');
        res.redirect(`/listing/${req.params.id}`);
    }
}));

module.exports = router;