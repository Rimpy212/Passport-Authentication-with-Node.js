const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const passport=require('passport');


//User model
const User=require('../models/User')
//let hashedPassword="";
//Login Page
router.get('/login',(req,res)=>{
    //rendering the login inside views
    res.render('login');
})


//register page
router.get('/register',(req, res)=>{
    //rendering the register inside views
    res.render('register');
})

// Register handle
router.post('/register',(req,res)=>{
    //console.log(req.body)
    const {name,email,password,password2}=req.body;
    let errors=[];

    //check required fields
    if(!name || !email || !password || !password2){
        errors.push({msg:"Please fill in all fields"});
    }

    //Check passwords match
    if(password != password2){
        errors.push({msg:"Passwords do not match"});
    }

    //Check password length
    if(password.length < 6){
        errors.push({msg:"Password should be at least 6 characters"});
    }

    if(errors.length > 0)
    {
        res.render('register',{
            errors,name,email,password, password2
        });
    }else{
       // res.send('pass');
        //Validation passed
        User.findOne({email:email})
        .then(user => {
            if(user){
                //User exists
                errors.push({msg: 'Email is already registered'});
                res.render('register',{
                    errors,name,email,password,password2
                });
            }
            else{
                const newUser=new User({
                    name,
                    email,
                    password
                });
                //User.insertMany(newUser)
            // const saveUser=newUser.save().then((data)=>data.json);
            //     console.log(newUser); 
            //     res.json(saveUser);

            //Hash password
            //we have to generate the salt to use hashing
            bcrypt.genSalt(10,(err, salt)=> bcrypt.hash(newUser.password,salt,(err,hash)=>{
                if(err) throw err;

                //Set Password to hashed
                newUser.password=hash;
                // hashedPassword=hash;

                // bcrypt.compare(newUser.password,hashedPassword,async(err,isMatch)=>{
                //     if(isMatch)
                //     {
                //         console.log('Encrypted password is: ', newUser.password);
                //         console.log('Decrypted password is: ', hashedPassword);
                //     }
                //     if (!isMatch) {
 
                //         // If password doesn't match the following
                //         // message will be sent
                //         console.log(hashedPassword + ' is not encryption of '
                //             + newUser.password);
                //     }
                // })



                //save user
                newUser.save()
                .then(user=>{
                    req.flash('success_msg','You are now registered and you can login');
                    res.redirect('/users/login')
                })
                .catch(err=> console.log(err));
            }))
            }
        })
    }
    //res.send("hello")
})



//Login handle
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',
    {
        successRedirect:'/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
})
module.exports=router;




//Logout handle
// router.get('/logout',(req,res)=>{
//     req.logout();
//     req.flash('success_msg','You are logged out');
//     res.redirect('/users/login');
// })


//req.logout() function now requires a callback 
router.get('/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      req.flash('success_msg', 'You are logged out');
      res.redirect('/users/login');
    });
  });