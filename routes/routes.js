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
router.post('/signup', passport.authenticate('signup', { session : false }) , async (req, res, next) => {
    console.log("hey")
    UserModel.findOne({email:req.body.email},function(err,vendor){
      vendor.phoneno = req.body.phoneno,
      vendor.name = req.body.name,
      vendor.storename = req.body.storename
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
    passport.authenticate('login', async (err, user, info) => {     
      try {
        if(err || !user){
          const error = new Error('An Error occurred')
          console.log(err)
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
          res.redirect('/user/profile?secret_token='+token)
        });     } catch (error) {
        return next(error);
      }
    })(req, res, next);
  });
  
  router.get('/vendor_details',async(req,res,next) => {
    res.render('vendor_details');
  });

  router.post('/vendor_details',async(req,res,next)=>{

  });

  router.get('/vendor_products',async(req,res,next)=>{
    var brand = BrandModel.find()
    ProductModel.find().populate('subcategory').exec((err,product)=>{
      res.render('vendor_product',{Category:product},{brand:brand});
    })
    
  })



  module.exports = router;