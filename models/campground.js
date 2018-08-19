var mongoose = require('mongoose')


//Template SETUP FOR DB
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: String,
    comments: [
      {
         type: mongoose.Schema.Types.ObjectId,      //just embed the reference to the comment
         ref: "Comment"                             //name of the model
      }
   ],
   author: {
       id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
       },
       username: String
   }
})

var Campground = mongoose.model("Campground", campgroundSchema)         //DB object, creates collection "campgrounds" in the the "yelp_camp" database, name is refractored

module.exports = Campground