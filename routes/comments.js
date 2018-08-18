var express = require("express")
var router = express.Router() 
var Campground = require("../models/campground")
var Comment = require("../models/comment")

router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req,res){         //isLoggedIn is a middleware function, will run first before callback
    //find by id
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err)
        }else{
            res.render("comments/newcomment.ejs", {campground: campground})
        }
    })
})

//CREATE comment
router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){                           //isLoggedIn is a middleware function
    //lookup campground using id => create new comment => connect comment to campground
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
        }else{
            Comment.create(req.body.comment, function(err, comment){    //req.body.comment is already an object, see newcomment.ejs 
                if(err){
                    console.log(err)
                }else{
                    //add username and id to the comment and then save it
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username     //We are sure there is a req.user because they have to be loggid in to get here
                    comment.save()
                    //add the comment itself
                    campground.comments.push(comment)
                    campground.save()
                    console.log("new comment created:\n", comment)
                    res.redirect("/campgrounds/"+campground._id)   
                }
            })
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


module.exports = router