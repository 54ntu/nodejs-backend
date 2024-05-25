const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const commentSchema =new mongoose.Schema({
    content:{
        type:String,
        required:true,
    },
    
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'video',
    },

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    }
},
{
    timestamps:true
}

);

commentSchema.plugin(aggregatePaginate);

const comments = mongoose.model('comments',commentSchema);
module.exports = {comments};
