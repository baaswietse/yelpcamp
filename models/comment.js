var mongoose = require('mongoose')

//template setup for Db
var commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"                             //We refere to the User model in the DB
        },
    username: String
    }
})
var comment = mongoose.model("Comment", commentSchema)

module.exports = comment