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

router.post('/vendor_products',(req,res,next)=>{
  // console.log({req.user})
   UserModel.findById(req.user._id, (err,vendor) => {
     var bflag = 0,sflag = 0,cflag = 0
     if(err){
       console.log(err)
     }

     vendor.category.forEach(category => {
      if(req.body.cid == category._id){
        cflag = 1;
         category.subcategory.forEach(subcategory => {
          if(req.body.sid== subcategory._id){
            sflag = 1 ;
             subcategory.brand.forEach(brand => {
              if(brand._id==req.body.bid){
                console.log("Brand has alredy been added")
                 bflag = 1; 
              }
              return(bflag)
            })
            if(bflag!=1){
              subcategory.brand.push(req.body.bid)
            }
            
          }

            return(sflag)  
            });
            if(sflag!=1){
              category.subcategory.push(req.body.sid);
              category.subcategory.forEach(subcategory => {
                if(subcategory._id == req.body.sid){
                  subcategory.brand.push(req.body.cid)
                }
              })
              
            }
      } 
      return(bflag)     
    });
    console.log({bflag})
    if(cflag!=1){
      //console.log({bflag})
      vendor.category.push(req.body.cid);
      
      (vendor.category).forEach(category => {
        if(category._id==req.body.cid){
          (category.subcategory).push(req.body.sid)
          (category.subcategory.brand).push(req.body.bid)
        }
      });

            }
            vendor.save()
    }


  )
});



module.exports = router;