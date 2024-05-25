const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },

    content:{
        type:String,
        required:true
    }

},
{
    timestamps:true
});


const tweets = mongoose.model('tweets',tweetSchema);
module.exports={tweets};