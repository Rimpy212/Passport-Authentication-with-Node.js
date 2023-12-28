const express=require('express');
const router=express.Router();
const {ensureAuthenticated}=require('../config/auth')


//Welcome page
router.get('/',(req,res)=>{
    //rendering welcome which is inside views
    res.render('welcome');
})


//Dashboard
//making it protected through ensureAuthenticated
router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    res.render('dashboard',{
        name : req.user.name
    })
})
module.exports=router;