const mongoose = require("mongoose");

const botConfigSchema = new mongoose.Schema({

    botId:{
        type:Number,
        required:true,
        unique:true
    },

    name:{
        type:String,
        required:true
    },

    enabled:{
        type:Boolean,
        default:true
    },

    order:{
        type:Number,
        required:true
    }

});

module.exports =
mongoose.model("BotConfig",botConfigSchema);