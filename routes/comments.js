var express = require("express")
var router = express.Router() 
var Campground = require("../models/campground")
var Comment = require("../models/comment")

//NEW comment
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
//EDIT comment
router.get("/campgrounds/:id/comments/:comment_id/edit", checkCommentOwnership,function(req, res){
    Comment.findById(req.params.comment_id,function(err, foundComment) {
        if(err){
            res.redirect("back")
        }else{
            res.render("comments/editComment.ejs", {campground_id: req.params.id, comment: foundComment})
        }
    })
    
})

//UPDATE comment
router.put("/campgrounds/:id/comments/:comment_id", checkCommentOwnership,function(req,res){
        Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
            if(err){
                res.redirect("back")
            }else{
                console.log("Comment updated:\n" + updatedComment)
                res.redirect("/campgrounds/" + req.params.id)
            }
        })
  
})

//DESTROY comment
router.delete("/campgrounds/:id/comments/:comment_id", checkCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back")
        }else{  
            console.log("comment deleted by", req.user.username)
            res.redirect("back")
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

function checkCommentOwnership(req, res, next){
    //is the user logged in?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back")
            }else{
                //is the loggedin user the owner of the campground?
                if(foundComment.author.id.equals(req.user._id)){     //we need the .equals() because foundCampground.author.id... is a object and req.user._id is a string
                    next()                                              //run the callback function after this one
                }else{
                    console.log("User tried to edit/delete someone elses comment")
                    res.redirect("back")
                }
            }
        })
    } else{
        console.log("User not logged in to edit/delete comment")
        res.redirect("back")
    }
}

module.exports = router