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
    User         =require("./models/user");
    

mongoose.connect("mongodb://localhost/yelp_camp_v3"); //create yelpcamp db inside mongodb
app.use(bodyParser.urlencoded({extended: true}));
passport.use(new LocalStrategy(User.authenticate()));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public")),
seedDB();

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

app.get("/", function(req, res) {
    res.render("campgrounds/home");
});

//INDEX ROUTE - show all campgrounds
app.get("/campgrounds", function(req, res) {
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err);
        } else {
             res.render("campgrounds/index", {camps:allCampgrounds,currentUser:req.user}); //data + name passing in
        }   
        });
    
});

//CREATE - add new campgrounds to database
app.post("/campgrounds", function (req, res){
    // get data from form and add to campgrounds array
    var name= req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
   //create a new campground and save to db
   Campground.create(newCampground, function(err, newlyCreated){
      if (err) {
          console.log(err);
      } else {
           // redirect back to campgrounds page
          res.redirect("/campgrounds"); //
      }
   });
});

//NEW - show form to create new campground 
app.get("/campgrounds/new", function(req, res){
   res.render("newCampground") 
});

//SHOW - shows more info about campground selected - to be declared after NEW to not overwrite
app.get("/campgrounds/:id", function(req, res){
    //find the campground with the provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if (err) {
           console.log(err);
       } else {
            //render show template with that campground
           res.render("campgrounds/show", {campground: foundCampground});
       }
    });
});

//Comments==========================================
app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
    //Find campground by id
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }
        res.render("comments/new",{campground:campground});
    });
   
});

app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
    //find campgrounds by id
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(error);
            res.redirect("/campgrounds/"+"campground._id");
        }
        else{
            //Create a new comment
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }
                else{
                    campground.comments.push(comment);
                    campground.save()
                    res.redirect("/campgrounds/"+campground._id)
                }
            });
        }
    });
});


//==========================
//Auth Routes
app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){
    var newUser=new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err)
            return res.redirect("/register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        });
    });
}); 

//LOGIN
app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login",passport.authenticate("local",
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login"
    }
),function(req,res){
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect("/login");
    }
}

//LOGOUT
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});

app.listen(3000,function(req,res){
    console.log("Server is Starting!");
});
