const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const ProductModel = require("../model/product");
const SubCategoryModel = require("../model/subcategory");
const BrandModel = require("../model/brand.js");
const UserModel = require('../model/model');
const router = express.Router();

//When the user sends a post request to this route, passport authenticates the user based on the
//middleware created previously
router.post('/signup', passport.authenticate('vendorsignup', { session : false }) , async (req, res, next) => {
    
  // get that user here
  // edit it
  // save it
  // otherwise you're making 2 DB calls for a single sign up
  // wastage of resources
  // bhai call
  
    UserModel.findOne({email:req.body.email},function(err,vendor){
      vendor.phoneno = req.body.phoneno,
      vendor.name = req.body.name,
      vendor.storename = req.body.storename,
      vendor.flag = false
      vendor.save();
    })
    res.json({
    message : 'Signup successful',
    user : req.user
  });
});

router.get('/signup',async(req,res,next)=>{
    res.render('signup')
})

router.get('/login',async(req,res,next)=>{
    res.render('login')
})

router.post('/login', async (req, res, next) => {
  console.log(req.body.password)
  console.log("inside vendor login")
    passport.authenticate('vendorlogin', async (err, user, info) => {    
      try {

        if(err || !user){
          const error = new Error('An Error occurred')
          // console.log(err)
          console.log(info)
          return next(error);
        }
        req.login(user, { session : false }, async (error) => {
          if( error ) return next(error)
          //We don't want to store the sensitive information such as the
          //user password in the token so we pick only the email and id
          const body = { _id : user._id, email : user.email };
          console.log(user)
          //Sign the JWT token and populate the payload with the user email and id
          const token = jwt.sign({ user : body },'top_secret');
          //Send back the token to the user
          // return res.json({ token,user });
          res.redirect('/vendor/vendor_products?secret_token='+token)
        });     
      } catch (error) {
          console.error(error);
        return next(error);
      }
    })(req, res, next);
  });
  
module.exports = router;