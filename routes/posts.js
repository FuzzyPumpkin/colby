var express = require("express");
var router = express.Router();
var Post = require("../models/posts");
var middle = require("../middleware");


//index
router.get("/posts", function(req, res){
   Post.find({}, function(err, allPosts){
      if(err){console.log("error");}
      else{res.render("posts/index", {posts:allPosts, currentUser: req.user});}
   });
});

//new
router.get("/posts/new", middle.isLoggedIn, function(req, res){
   if(req.user.username == "Colby"){
      res.render("posts/new");
      
   }
   else {
      res.render("sekkrit");
   }
});

//create
router.post("/posts", middle.isLoggedIn, function(req, res){
   var title = req.body.title;
   var image = req.body.image;
   var link = req.body.link;
   var description = req.body.description;
   var author = {
      id: req.user._id,
      username: req.user.username
   };
   var newPost = {title: title, image: image, link: link, description: description, author: author};
   Post.create(newPost, function(err, addedPost){
      if(err){console.log(err);}
      else{res.redirect("/posts");}
   });
});

//show
router.get("/posts/:id", function(req, res){
   Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
      if(err){console.log(err);}
      else{
         res.render("posts/show", {post: foundPost});
      }
   });
});

//edit
router.get("/posts/:id/edit", middle.checkOwnership, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        res.render("posts/edit", {post: foundPost});
    });
});


//update
router.put("/posts/:id", middle.checkOwnership, function(req, res){
    // find and update the correct post
    Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost){
       if(err){
           res.redirect("/posts");
       } else {
           res.redirect("/posts/" + req.params.id);
       }
    });
});

//delete
router.delete("/posts/:id", middle.checkOwnership, function(req, res){
   Post.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/posts");
      } else {
          res.redirect("/posts");
      }
   });
});

module.exports = router;