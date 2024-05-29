process.env.NODE_ENV = "production";
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const listingsRouter = require('./routes/listingRoutes.js');
const reviewsRouter = require('./routes/reviewRoutes.js');
const usersRouter = require('./routes/userRoutes.js');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/userSchema.js');

// setting view engine as ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// accessing static files 
app.use(express.static(path.join(__dirname, "/public")));

// parsing req.body
app.use(express.urlencoded({extended: true}));

// using method override for accepting other requests than GET and POST
app.use(methodOverride('_method'));

// adding boilerplate features using ejs mate 
app.engine('ejs', ejsMate);

const store = MongoStore.create({
    mongoUrl: process.env.Mongo_URL,
    crypto:{
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
});

store.on("error", ()=>{
    console.log("Error in Mongo store", err);
});

const sessionOptions = {
    store,
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

// using session
app.use(session(sessionOptions));
app.use(flash());

// Authentication
app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.redirectUrl = req.pathUrl;
    return next();
});

// mounting routes
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter);

// connecting to server
main().then(()=>{
    console.log("Connected to MongoDB");
}).catch(err=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(process.env.Mongo_URL);
}

app.listen(port, ()=>{
    console.log(port);
});

//Error Handling Middleware for all non-routes
app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page not found!"));
});

//Error Handling Middleware for all routes
app.use((err, req, res, next)=>{
    let {status = 500, message = "Something went wrong!"} = err;
    res.status(status).render("listings/error.ejs", {message, title:"Error"});
});


