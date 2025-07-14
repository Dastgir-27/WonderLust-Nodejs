const User = require("../models/user.js");
const Listing = require("../models/listing.js");

module.exports.signUpForm = (req,res) => {
   res.render("./users/signup.ejs");
}

module.exports.signUp = async(req,res,next) => {
    try{
    let {username,email,password} = req.body;
    const newUser = new User({email, username});
    let registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err) => {
        if(err){ 
            return next(err);
        }
        req.flash("success","Welcome To Wonderlust!");
        res.redirect("/listing");
    });
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}

module.exports.loginForm = (req,res) => {
   res.render("./users/login.ejs");
}

module.exports.login = async(req,res) => {
    req.flash("success","Successful Logged In!");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
}

module.exports.logOut = (req,res,next) =>{
    req.logout((err) => {
        if(err){
           return next(err);
        }
        req.flash("success","logged Out Successfully!");
        res.redirect("/login");
       
    })
}

module.exports.search = async (req,res) => {
    let {country} = req.query;
    let categories = req.query.categories;
    let allListing;
    if(country){
        allListing = await Listing.find({country: country});
    }
    if(categories){
        allListing = await Listing.find({categories: categories});
    }

    if(allListing.length == 0){
        req.flash("error","Match not found!");
        return res.redirect("/listing");
    }

    res.render("./users/search.ejs",{allListing});
}