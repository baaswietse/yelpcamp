var Campground = require("../models/campground")
var Comment = require("../models/comment")


//all the middleware
var middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function(req, res, next){
     //is the user logged in?
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found")
                res.redirect("back")
            }else{
                //is the loggedin user the owner of the campground?
                if(foundCampground.author.id.equals(req.user._id)){     //we need the .equals() because foundCampground.author.id... is a object and req.user._id is a string
                    next()                                              //run the callback function after this one
                }else{
                    req.flash("error", "You don't have permission to do that")
                    console.log("User tried to edit/delete someone elses campground")
                    res.redirect("back")
                }
            }
        })
    } else{
        req.flash("error", "You need to be logged in to do that")
        console.log("User not logged in to edit/delete campground")
        res.redirect("back")
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    //is the user logged in?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Something went wrong")
                res.redirect("back")
            }else{
                //is the loggedin user the owner of the campground?
                if(foundComment.author.id.equals(req.user._id)){     //we need the .equals() because foundCampground.author.id... is a object and req.user._id is a string
                    next()                                              //run the callback function after this one
                }else{
                    req.flash("error", "You don't have permission to do that")
                    console.log("User tried to edit/delete someone elses comment")
                    res.redirect("back")
                }
            }
        })
    } else{
        req.flash("error", "You need to be logged in to do that")
        console.log("User not logged in to edit/delete comment")
        res.redirect("back")
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }else{
        req.flash("error", "You need to be logged in to do that!")      //doesnt show directly, we can acces it in the next request, so we handle it in /login
        res.redirect("/login")
    }
}





module.exports = middlewareObj