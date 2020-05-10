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
  res.render('vendor_details',{secret_token:req.query.secret_token});
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

router.post('/vendor_products',(req,res,next)=>{
  // console.log({req.user})
   UserModel.findById(req.user._id, (err,vendor) => {
     var pflag = 0
     if(err){
       console.log(err)
     }
     var newproduct = {
      category: req.body.cid,
      subcategory: req.body.sid,
      brand: req.body.bid
    }

    var l = (vendor.product).length;
    for (var i = 0; i < l; i++) {
      if(vendor.product[i].category==newproduct.category&&vendor.product[i].subcategory==newproduct.subcategory&&vendor.product[i].brand==newproduct.brand)
      //Do something
      pflag = 1
      console.log("this product has alredy been added")
  }

    //  (vendor.product).forEach(product => {
    //    console.log(product)
    //   //  if(product.category._id==newproduct.category&&product.subcategory._id==newproduct.subcategory&&product.brand._id==newproduct.brand){
    //   //    console.log("this has alredy been added")
    //   //    pflag = 1
    //   //  }
    //   //  return pflag
       
    //  });
     if(pflag!=1){

      vendor.product.push(newproduct),
     vendor.save();
     console.log(vendor)
     res.send(vendor.product)
      }
    })
});



module.exports = router;