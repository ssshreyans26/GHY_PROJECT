const express = require('express');
const ProductModel = require('../model/product');
const SubCategoryModel = require("../model/subcategory");
const BrandModel = require("../model/brand.js");
const UserModel = require('../model/model');
const router = express.Router();

//Let's say the route below is very sensitive and we want only authorized users to have access

//Displays information tailored according to the logged in user
router.get('/profile', (req, res, next) => {
  //We'll just send back the user details and the token
  res.json({
    message : 'You made it to the secure route',
    user : req.user,
    token : req.query.secret_token
  })
});

router.get('/vendor_details',async(req,res,next) => {
  res.render('vendor_details');
});

router.post('/vendor_details',async(req,res,next)=>{

});

router.get('/vendor_products',async(req,res,next)=>{
  // var brand = BrandModel.find()

    ProductModel.find().populate('subcategory').exec((err,product)=>{
    BrandModel.find(function(err,brand){
      res.render('vendor_product',{Category:product,Brand:brand,secret_token:req.query.secret_token});
    })
  })    
})

router.post('/vendor_products',async(req,res,next)=>{
  UserModel.findById(req.user._id,async (err,vendor) => {
    vendor.product.category.forEach(category => {
      if(req.body.cid == category._id){
        vendor.product.subcategory.forEach(subcategory => {
          if(req.body.sid== subcategory._id){
            subcategory.brand.forEach(brand => {
              if(brand._id==req.body.bid){
                alert("Brand has alredy been added")
              }
            })
            
          }
              
            });
      }      
    });

  })
});



module.exports = router;