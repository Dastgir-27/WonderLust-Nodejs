if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const expressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.MONGO_ATLAS_LINK;
async function main(){
await mongoose.connect(dbUrl);
}

main()
.then(() => console.log("connected to db"))
.catch((err) => console.log(err));

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine("ejs",ejsMate);

const store = MongoStore.create({ 
    mongoUrl: dbUrl,
    crypto: {
    secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize()); //It is important to place this line after the session middleware.
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(8080, () => {
    console.log("Server is listening at 8080");
});

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//Listings
app.use("/listing", listingRouter);
//Reviews
app.use("/listing/:id/reviews",reviewRouter);
//Users
app.use("/",userRouter);  

app.all("*",(req,res,next) => {
    next(new expressError(404,"page not found!"));
});

app.use((err,req,res,next)=>{
    let {status="500",message="something went wrong!"} = err;
    res.status(status).render("error.ejs",{message});
});