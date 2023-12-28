//Creating schema with all the different fields that we need for a user
const mongoose=require('mongoose')

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:String,
        default:Date.now
    }
})

//mongoose.model is used to create a model based on a schema. It takes two arguments:

//The singular name of the collection that will be created from this model, in this case, 'User'.
//The schema to use for the model, in this case, UserSchema.
const User=mongoose.model('User',UserSchema);

module.exports=User;