//Make sure database is running by ./mongod in ~$ directory
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    mongoose        = require('mongoose'),
    passport        = require('passport'),
    flash           = require("connect-flash"),         //flash messages
    LocalStrategy   = require("passport-local"),
    User            = require("./models/user"),          //MODEL
    seedDB          = require("./seeds")                //MODEL
    
//requiring all our routes    
var commentRoutes       = require("./routes/comments"),     
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index")
    
//mongoose.connect("mongodb://localhost:27017/yelp_camp_v3", { useNewUrlParser: true })    //Creates the database "yelp_camp" if non existent, otherwise open it
mongoose.connect("mongodb://baaswietse:W942018d@ds125372.mlab.com:25372/yelpcampwietse", { useNewUrlParser: true })

app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))      //links to the css folder
app.use(methodOverride("_method"))                  //used to update
app.use(flash())
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


app.use(function(req, res, next){       //custom middleware, that adds the logged in users information to all our routes, and the flash variable to prevent errors when there is no flash message
    res.locals.currentUser = req.user
    res.locals.error = req.flash("error")
    res.locals.succes = req.flash("succes")
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
