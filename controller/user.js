const User = require("../models/user.js");
const passport = require("passport");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res) => {
    try{
        let { username, email, password } = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        // login after signup
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "User Registered Successfully");
            res.redirect("./listings");
        });
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

// Passport provides an authenticate() function, which is used as route middleware to authenticate requests.
// router.post("/login", passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async(req, res) => {
//     console.log("Login successful for:", req.user);
//     req.flash("success", "Login successful!");
//     res.redirect("/listings");
// });

module.exports.login = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            console.log("Passport error:", err);
            return next(err);
        }
        if (!user) {
            console.log("Authentication failed:", info);
            req.flash("error", "Invalid username or password");
            return res.redirect("/login");
        }
        req.logIn(user, function(err) {
            if (err) {
                console.log("Login error:", err);
                return next(err);
            }
            console.log("Authentication successful for user:", user);
            req.flash("success", "Login successful!");
            let redirectUrl = res.locals.redirectUrl || "/listings";
            return res.redirect(redirectUrl);
        });
    })(req, res, next);
};

// module.exports.login = passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true // Uses the default flash message
//     // failureFlash: "Invalid username or password" // Custom flash message
// }), 
// async (req, res) => {
//     console.log("Login successful for:", req.user);
//     req.flash("success", "Login successful!");
//     let redirectUrl = res.locals.redirectUrl || "/listings";
//     res.redirect(redirectUrl);
// }

module.exports.logout = (req, res, next) => {
    req.logout((err) =>{
        if(err) {
            return next(err);
        }
        req.flash("success", "You are logged out!")
        res.redirect("/listings");
    });
}