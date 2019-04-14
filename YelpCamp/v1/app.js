var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended:true}));

var campgroundSchema=new mongoose.Schema({
    name:String,
    image:String,
    description:String
});

var Campground=mongoose.model("Camp",campgroundSchema);

// Campground.create(
//     {
//     name:"Rialto",
//     image:"https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
//     description:"Bullaki Jaana Mai Kaun!"
//     },function(err,campground){
//         if(err){
//             console.log("Error!")
//         }
//         else{
//             console.log("Added Campground is...")
//             console.log(campground);
//         }
//    });

var camps=[
    {name:"Rialto",image:"https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"},
    {name:"Dust",image:"https://images.pexels.com/photos/618848/pexels-photo-618848.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"},
    {name:"Canals",image:"https://images.pexels.com/photos/558454/pexels-photo-558454.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"},
    {name:"Rialto",image:"https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"},
    {name:"Dust",image:"https://images.pexels.com/photos/618848/pexels-photo-618848.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"},
    {name:"Canals",image:"https://images.pexels.com/photos/558454/pexels-photo-558454.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"},
]

app.set("view engine","ejs");

app.get("/",function(req,res){
    res.render("home")
});

app.get("/campgrounds",function(req,res){
    Campground.find({},function(err,allCamps){
        if(err){
            console.log(err);
        }
        else{
            res.render("index",{camps:allCamps});
        }
    });
});

app.post("/campgrounds",function(req,res){
     var name=req.body.name;
     var image=req.body.image;
     var desc=req.body.description;
     console.log(desc);
     var newCampground={name:name,image:image,description:desc};
     Campground.create(newCampground,function(err,newCamp){
         if(err){
             console.log(err);
         }
         else{
            res.redirect("/campgrounds");
         }
     })
     
});

app.get("/campgrounds/new",function(req,res){
    res.render("newCampground");
});

app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id,function(err,foundCamp){
        if(err){
            console.log(err);
        }
        else{
            res.render("show",{campground:foundCamp});
        }
    });
});

app.listen(3000,function(req,res){
    console.log("Server is Starting!")
});
