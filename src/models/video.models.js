const mongoose = require('mongoose')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')


const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },

    duration: {
      type: Number, //we will get duration from cloudinary
      required: true,
    },

    views:{
        type:Number,
        default:0
    },

    isPublished:{
        type:Boolean,
        default:true
    },

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },

    videoFile:{
        type:String,    ///we will assign cloudinary url
        required:true
        
    },

    thumbnail:{
        type:String,
        required:true
    }



  },
  { timestamps: true }
);


videoSchema.plugin(aggregatePaginate)

const video = mongoose.model('video', videoSchema)
module.exports = {video}