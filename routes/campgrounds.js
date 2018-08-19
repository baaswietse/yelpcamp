var express = require("express")
var router = express.Router()                       //We use the express router to assign the routes to it
var Campground = require("../models/campground")
var middleware = require("../middleware")           //if we require a folder, it wil automaticly take the index.js file!!

//SHOW Homepage    
router.get("/", function(req, res){
    res.render("landing.ejs")
})

//Render campgrounds page from DB
router.get("/campgrounds", function(req, res){
    Campground.find({}, function(err,allCampgrounds){      //Get all the data from DB campgrounds
        if(err){
            req.flash("error", "Something went wrong")
            console.log(err)
            res.redirect("back")
        }else{
            res.render("campgrounds/campgrounds.ejs",{campgrounds: allCampgrounds})
    }
    })
})

//CREATE - ADD campground to DB
router.post("/campgrounds", middleware.isLoggedIn,function(req, res){
    var name = req.body.name
    var image = req.body.image
    var desc = req.body.desc
    var price = req.body.price
    var author = {
        id : req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price: price,image: image, description: desc,author: author }
    Campground.create(newCampground, function(err, newCampground){
        if(err){
            req.flash("error", "Something went wrong")
            console.log(err)
            res.redirect("back")
        }else{
            console.log("New campground created:\n", newCampground)
            //redirect back to campgrounds page
            req.flash("succes", "Successfully created a campground!")
            res.redirect("/campgrounds")
        }
    })
})

//NEW -- show the add campground page
router.get("/campgrounds/new", middleware.isLoggedIn,function(req, res){
   res.render("campgrounds/newcampground.ejs")
})

//SHOW single campground
router.get("/campgrounds/:id", function(req, res){
    //find campground with provided id and render show template, id = req.params.id
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){    //add the comments inside the campground, instead of only the id
        if(err){
            req.flash("error", "Something went wrong")
            console.log(err)
            res.redirect("back")
        }else{
            //render show template
            res.render("campgrounds/showCampground.ejs", {campground: foundCampground})
        }
    })
})

//EDIT a campground
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    //is the user logged in?
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err)
            req.flash("error", "Something went wrong")
            res.redirect("back")
        }else{
            res.render("campgrounds/editCampground.ejs", {campground: foundCampground})
        }
    })
  

})

//UPDATE the campground that is edited
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req,res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            req.flash("error", "Campground not found")
            console.log(err)
            req.redirect("back")
        }else{
            req.flash("succes", "Successfully edited the campground!")
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

//DESTROY - deletes a campground
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Something went wrong")
            console.log(err)
            res.redirect("back")
        }else{
            req.flash("succes", "Succesfully deleted the campground!")
            res.redirect("/campgrounds")
        }
    })
})




module.exports = router