const mongoose = require("mongoose")


const subscriptionSchema = new mongoose.Schema({
    subscriber:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    channel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    }

},{timestamps:true})


const Subscribtion = mongoose.model("Subscribtion",subscriptionSchema);

module.exports  ={
Subscribtion
}