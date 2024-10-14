/**
 * npm init -y
 * npm i express
 * npm i ejs
 * npm i mongoose
 * npm i method-override
 * touch app.js
 * 
 * npm i ejs-mate
 * npm i joi
 * npm i cookie-parser
 * npm i express-session
 * npm i connect-flash
 * 
 * npm i passport
 * npm i passport-local
 * 
 * npm install cloudinary@1.21.0
 * npm i multer-storage-cloudinary
 * 
 * npm i connect-mongo
 */
if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
// console.log(process.env); // remove this after you've confirmed it is working
// console.log(process.env.ATLAS_DB_URL);  // Add this to check if ATLAS_DB_URL is loaded

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); // helps creating templates
const ExpressError = require("./utils/ExpressError.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStartegy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLAS_DB_URL;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({extended: true})); // Parse URL-encoded data >> required to parse data from req.body
app.use(methodOverride("_method")); // Use method override for PUT and DELETE
app.engine('ejs', ejsMate);

main().then((res) => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

app.listen(8080, () => {
    console.log(`server is listening to port: 8080`);
});

/** SessionOptions
 * ============================================================================================================================================
 */
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600, // Interval (in seconds) between session updates.
});
// NOTE: The maximum lifetime (in seconds) of the session which will be used to set session.cookie.expires if it is not yet set. Default is 14 days.

store.on("error", () => {
    console.log("ERROR IN MONGO SESSION", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET, 
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request.
    saveUninitialized: true, //Forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified.
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set expiry to 1 week from now
        maxAge: 7 * 24 * 60 * 60 * 1000, // maxAge is also set to 1 week
        httpOnly: true,
    }
}
// NOTE: expires property expects a Date object, not a timestamp in milliseconds


/** Cookies
 * ============================================================================================================================================
 */
app.use(cookieParser("secretcode"));

app.get("/getsignedcookie", (req, res) => {
    res.cookie("made-in", "India", { signed: true });
    res.send("signed cookie sent");
});

app.get("/verify", (req, res) => {
    // console.log(req.cookies); // this will not allow signed cookies
    console.log(req.signedCookies); // to access signed cookies
    res.send("verified");
});

app.get("/getcookies", (req, res) => {
    res.cookie("greet", "namaste");
    res.cookie("madeIn", "India");
    res.send("sent you some cookies");
});

/** Session
 * ============================================================================================================================================
 * A web application needs the ability to identify the users as they browse from page to page.
 * This series of requests & responses, each asscociated with the same user, is knwon as a SESSION.
 */
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStartegy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser()); // storing user's detail in session
passport.deserializeUser(User.deserializeUser());  // un-storing user's detail from session

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.get("/register", (req, res) => {
    let { name = "anonymous"} = req.query; // `/register?name=ankush`
    req.session.name = name;
    console.log(req.session.name);

    if(name == `anonymous`) {
        req.flash("error", "user not registered");
    } else {
        req.flash("success", "user registered successfully!");
    }
    res.redirect("/hello");
});

app.get("/hello", (req, res) => {
    res.render("./flash/page.ejs", { name: req.session.name });
});

app.get("/demouser", async (req, res) => {
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "delta-student"
    });

    let registeredUser = await User.register(fakeUser, "password@123");
    res.send(registeredUser);
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


/** Error handling
 * ============================================================================================================================================
 */

// if any route doesn't match
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!!!"));
});

// Step-1
// app.use((err, req, res, next) => {
//     res.send("Something Went Wrong!!!");
// });

// Step-2
app.use((err, req, res, next) => {
    let{statusCode = 500, message = "Something went wrong!!!"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", { message });
});


