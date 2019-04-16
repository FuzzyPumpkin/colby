var mongoose = require("mongoose");
 
var postSchema = new mongoose.Schema({
   title: String,
   image: String,
   link: String,
   description: String,
   createdDate: { type: Date, default: Date.now },
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});
 
module.exports = mongoose.model("Post", postSchema);