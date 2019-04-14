var express      = require("express"),
    app          = express(),
    bodyParser   = require("body-parser"),
    mongoose     = require("mongoose"),
    Campground   = require("./models/campgrounds"),
    seedDB       = require("./seeds"),
    Comment      = require("./models/comment"),
    passport     =require("passport"),
    LocalStrategy=require("passport-local"),
    passportLocalMongoose=require("passport-local-mongoose"),
    User         =require("./models/user"),
    commentRoutes=require("./routes/comment"),
    authRoutes   =require("./routes/auth"),
    campgroundRoutes=require("./routes/campground"),
    methodOverride=require("method-override");
    
mongoose.connect("mongodb://localhost/yelp_camp_v3"); //create yelpcamp db inside mongodb
app.use(bodyParser.urlencoded({extended: true}));
passport.use(new LocalStrategy(User.authenticate()));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public")),
app.use(methodOverride("_method"));
//seedDB();

//Passport Config
app.use(require("express-session")({
    secret:"aayush is great!",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
//Adding current user attribute to every route
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    return next();
});
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/campgrounds/:id/comments",commentRoutes);
app.use(authRoutes);
app.use("/campgrounds",campgroundRoutes);

app.listen(3000,function(req,res){
    console.log("Server is Starting!");
});
