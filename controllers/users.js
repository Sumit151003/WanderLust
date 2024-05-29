const User = require("../models/userSchema.js");


module.exports.renderSignUpPage = async (req, res) => {
    res.render("users/signUp.ejs", { title: "Wanderlust | Signup" });
};

module.exports.signUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err)=>{
            if(err) {
                return next(err);
            }
            req.flash("success", `${username}, Welcome to WanderLust`);
            res.redirect("/listings");
        })} catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup")
    }
};

module.exports.renderLogInPage = async (req, res) => {
    res.render("users/login.ejs", { title: "Wanderlust | LogIn" });
};

module.exports.logIn = async (req, res) => {
    let { username } = req.body;
    req.flash("success", `${username}, Welcome back to WanderLust`);
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
};

module.exports.logOut = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};
