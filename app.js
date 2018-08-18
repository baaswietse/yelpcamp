//Make sure database is running by ./mongod in ~$ directory
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    mongoose        = require('mongoose'),
    passport        = require('passport'),
    LocalStrategy   = require("passport-local"),
    User            = require("./models/user"),          //MODEL
    seedDB          = require("./seeds")                //MODEL
    
//requiring all our routes    
var commentRoutes       = require("./routes/comments"),     
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index")
    
mongoose.connect("mongodb://localhost:27017/yelp_camp_v3", { useNewUrlParser: true })    //Creates the database "yelp_camp" if non existent, otherwise open it

app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))      //links to the css folder
app.use(methodOverride("_method"))                  //used to update

//seedDB()    //Seeds the DB everytime the server runs

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "wietse is de coolste",
    resave: false,
    saveUninitialized : false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use(function(req, res, next){       //custom middleware, that adds the user information to the data that is passed to the ejs templates (used for th eheader login/logout/register button's state)
    res.locals.currentUser = req.user
    next()
})

//add the imported routes to our app object
app.use(indexRoutes)
app.use(campgroundRoutes)
app.use(commentRoutes)




app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!")
})



//mongo => show dbs => use cat_app => show collections => db.cats.find()
//                                                          .drop() => Deletes all