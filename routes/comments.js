var express = require("express");
var router = express.Router();
var Post = require("../models/posts");
var Comment = require("../models/comments");
var middle = require("../middleware");

//Comments new
router.get("/posts/:id/comments/new", middle.isLoggedIn, function(req, res){
    Post.findById(req.params.id, function(err, post){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {post: post});
        }
    });
});

//create
router.post("/posts/:id/comments", function(req, res){
   Post.findById(req.params.id, function(err, post){
       if(err){
           console.log(err);
           res.redirect("/posts");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //setup comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.save();
               //add to comments
               post.comments.push(comment);
               post.save();
               res.redirect('/posts/' + post._id);
           }
        });
       }
   });
});

//edit
router.get("/posts/:id/comments/:comment_id/edit", middle.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){res.redirect("back");}
        else{
            res.render("comments/edit", {post_id: req.params.id, comment: foundComment});
        }
    });
});

//update
router.put("/posts/:id/comments/:comment_id", middle.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){res.redirect("back")}
        else{
            res.redirect("/posts/ + req.params.id");
        }
    });
});

//delete
router.delete("/posts/:id/comments/:comment_id", middle.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){res.redirect("back");}
        else{
            req.flash("success", "Comment deleted.");
            res.redirect("/posts/" + req.params.id);
        }
    });
});


module.exports = router;