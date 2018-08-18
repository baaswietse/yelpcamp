var express = require("express")
var router = express.Router()       //We use the express router to assign the routes to it
var Campground = require("../models/campground")

//SHOW Homepage    
router.get("/", function(req, res){
    res.render("landing.ejs")
})

//Render campgrounds page from DB
router.get("/campgrounds", function(req, res){
    Campground.find({}, function(err,allCampgrounds){      //Get all the data from DB campgrounds
        if(err){
            console.log(err)
        }else{
            res.render("campgrounds/campgrounds.ejs",{campgrounds: allCampgrounds})
    }
    })
})

//CREATE - ADD campground to DB
router.post("/campgrounds", isLoggedIn,function(req, res){
    var name = req.body.name
    var image = req.body.image
    var desc = req.body.desc
    var author = {
        id : req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc,author: author }
    Campground.create(newCampground, function(err, newCampground){
        if(err){
            console.log(err)
        }else{
            console.log("New campground created:\n", newCampground)
            //redirect back to campgrounds page
            res.redirect("/campgrounds")
        }
    })
})

//NEW -- show the add campground page
router.get("/campgrounds/new", isLoggedIn,function(req, res){
   res.render("campgrounds/newcampground.ejs")
})

//SHOW single campground
router.get("/campgrounds/:id", function(req, res){
    //find campground with provided id and render show template, id = req.params.id
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){    //add the comments inside the campground, instead of only the id
        if(err){
            console.log(err)
        }else{
            //render show template
            res.render("campgrounds/showCampground.ejs", {campground: foundCampground})
        }
    })
})

//EDIT a campground
router.get("/campgrounds/:id/edit", checkCampgroundOwnership, function(req, res){
    //is the user logged in?
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/editCampground.ejs", {campground: foundCampground})
    })
  

})

//UPDATE the campground that is edited
router.put("/campgrounds/:id", checkCampgroundOwnership, function(req,res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            console.log(err)
        }else{
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

//DESTROY - deletes a campground
router.delete("/campgrounds/:id", checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err)
        }else{
            res.redirect("/campgrounds")
        }
    })
})

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }else{
        res.redirect("/login")
    }
}

function checkCampgroundOwnership(req, res, next){
    //is the user logged in?
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back")
            }else{
                //is the loggedin user the owner of the campground?
                if(foundCampground.author.id.equals(req.user._id)){     //we need the .equals() because foundCampground.author.id... is a object and req.user._id is a string
                    next()                                              //run the callback function after this one
                }else{
                    console.log("User tried to edit/delete someone elses campground")
                    res.redirect("back")
                }
            }
        })
    } else{
        console.log("User not logged in to edit/delete campground")
        res.redirect("back")
    }
}



module.exports = router