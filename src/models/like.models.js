const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "comments",
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "video",
  },

  likedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  tweet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tweets",
  },
},

{
    timestamps:true,
}

);

const likes = mongoose.model("likes",likeSchema);
module.exports ={likes}