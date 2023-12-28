const LocalStrategy= require('passport-local').Strategy;
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');



// Load User Model
const User=require('../models/User');
const { use } = require('passport');


module.exports=function(passport){
    passport.use(
        new LocalStrategy({usernameField:'email'},(email,password,done)=>{
            //Match User
            User.findOne({email:email})
            .then(user=> {
                if(!user)
                {
                    return done(null,false,{message: 'That email is not registered'});
                }

                //Match password
                //comparing the password this plain password and hashed password
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err) throw err;
                    if(isMatch)
                    {
                        return done(null,user);
                    }
                    else{
                        return done(null,false,{message:'Password incorrect'});
                    }
                })
            })
            .catch(err=>console.log(err));
        })
    );

    passport.serializeUser(function(user,done){
        done(null,user.id);
    });


    // passport.deserializeUser(function(id, done){
    //     User.findById(id,function(err,user){
    //         done(err,user);
    //     })
    // })

    //this User.findById() no longer accepts a callback so we have to use .exec() method for that

    passport.deserializeUser(function (id, done) {
        try {
          const user =User.findById(id).exec();
          done(null, user);
        } catch (err) {
          done(err, null);
        }
      });
}