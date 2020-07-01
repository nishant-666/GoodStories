const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    googleId:{
        type:String,
        required:true
    },
    displayName:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    LastName:{
        type:String,
        required:true
    },
    Image:{
        type:String,
       
    }, 
     createdAt:{
        type:Date,
        default: Date.now 
    }
})

module.exports = mongoose.model('User',UserSchema)