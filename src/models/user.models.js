const mongoose = require("mongoose");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: [true, "password is required"],
    },

    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "video",
      },
    ],

    avatar: {
      type: String, //cloudinary url will be given in this point
      required: true,
    },

    coverImage: {
      type: String,
    },
    refreshToken: {
      type: string,
    },
  },
  { timestamps: true }
);


userSchema.pre('save', async function(next){
    if(!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password, 10)
    next()
})


userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateAccessToken = function(){

  return  jwt.sign(
      {
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName,
      },

      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
      }
    );


}

userSchema.methods.generateRefreshToken = function(){


     return jwt.sign(
       {
         _id: this._id,
       },

       process.env.REFRESS_TOKEN_SECRET,
       {
         expiresIn: process.env.REFRESS_TOKEN_EXPIRY,
       }
     );

}
const user = mongoose.model("user", userSchema);
module.exports = { user };
