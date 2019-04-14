var express=require("express");
var router=express.Router({mergeParams:true});
var Campground=require("../models/campgrounds");
var Comment=require("../models/comment");

//Comments==========================================
router.get("/new",isLoggedIn,function(req,res){
    //Find campground by id
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }
        res.render("comments/new",{campground:campground});
    });
   
});

router.post("/",isLoggedIn,function(req,res){
    //find campgrounds by id
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds/");
        }
        else{
            //Create a new comment
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }
                else{
                    //add username and id to comment
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    //saving comment
                    campground.comments.push(comment);
                    campground.save()
                    res.redirect("/campgrounds/"+campground._id)
                }
            });
        }
    });
});

//EDIT Comments
router.get("/:comment_id/edit",function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit_comment",{campground_id:req.params.id,comment:foundComment});
        }
    });
});

router.put("/:comment_id",function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//DELETE Comments
router.delete("/:comment_id",function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect("/login");
    }
}

module.exports=router;
