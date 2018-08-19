var express = require("express")
var router = express.Router() 
var passport = require("passport")
var User = require("../models/user")

//--------AUTH------------
//display signup
router.get("/register", function(req,res){
    res.render("register.ejs")
})

//handle signup
router.post("/register", function(req,res){
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message)
            console.log(err)
            res.redirect("/register")
        }else{
            console.log("new user:\n", user)   //the new user
            passport.authenticate("local")(req, res, function(){    //log the new user in
                req.flash("succes", "Welcome to YelpCamp "+ user.username)
                res.redirect("/campgrounds")
            })
            
        }
    })
})


//SHOW login form
router.get("/login", function(req,res){
    res.render("login.ejs")
})

//handle login
router.post("/login",   passport.authenticate("local", {successRedirect: "/campgrounds",failureRedirect: "/login"})  ,function(req, res){    //we gave a second argument (middleware) to the app.post, this code will be run before callback
                                                                                                                                            //this tries to log in first, automatic takes the req.body.username and password
});    

//logout
router.get("/logout", function(req, res) {
    req.logout()
    req.flash("succes", "Logged you out!")
    res.redirect("/campgrounds")
})



module.exports = router