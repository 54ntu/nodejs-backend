const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "video",
      },
    ],

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const playList = mongoose.model("playList", playlistSchema);
module.exports = { playList };
