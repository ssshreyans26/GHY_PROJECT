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

router.get("/vendor",(req,res,next)=>{
  UserModel.find(function(err,vendor){
    if (err) console.log(err);
    else{
      console.log(vendor)
      res.render('admin_vendor',{vendor:vendor,secret_token:req.query.secret_token})
    }    
  })
})

router.post("/vendor",(req,res,next)=> {
  var approval = req.body.approval
  var userid = req.body.userid  
    UserModel.findById(userid,function(err,user){
      console.log(user)
      if(err) console.log(err);
      else{
        if(approval=="1"){
        user.flag = true
        user.save()
        res.send(user);
      }
        else{
          user.remove()
          res.send("User Declined")
        }
      }

    });
  
})


router.get("/brand", (req, res, next) => {
  console.log("inside product get");
  BrandModel.find(function(err,brand){
    if (err) console.log(err);
    if (brand) {
      console.log(brand)
      res.render("admin_brand",{brand:brand,secret_token:req.query.secret_token});    
    }
  })
  
});

router.post("/brand",(req,res,next)=>{
  var b1 = req.body.brandname
  console.log(b1)
  BrandModel.findOne({ brandname: b1 }, function (err, brand) {
    if (err) console.log(err);
    if (brand) {
      console.log("This has already been saved");
    } else {
      var brand = new BrandModel({
        brandname: b1,
      });
      brand.save(function (err, brand) {
        if (err) console.log(err);
        console.log("New product created");
        console.log(brand);
        res.send(brand);
      });
          }          
  });
})

router.get("/product", (req, res, next) => {
  console.log("inside product get");
  ProductModel.find().populate('subcategory').exec((err,product)=>{
    res.render("admin_product",{Category:product,secret_token:req.query.secret_token});
    // res.send(product)
  })    
});


router.post("/product", (req, res, next) => {
  console.log(req.body);
  var c1 = req.body.category;
  var s1 = req.body.subcategory;
  console.log(c1);
  console.log(s1);

  ProductModel.findOne({ categoryname: c1 }, function (err, product) {
    if (err) console.log(err);
    if (product) {
      console.log("This has already been saved");
    } else {
      var product = new ProductModel({
        categoryname: c1,
      });
      product.save(function (err, product) {
        if (err) console.log(err);
        console.log("New product created");
        console.log(product);
      });
    }
  });
  SubCategoryModel.findOne({ subcategoryname: s1 }, function (err, subcategory) {
    if (err) console.log(err);
    if (subcategory) {
      console.log("This has already been saved");
    } else {
      var subcategory = new SubCategoryModel({
        subcategoryname: s1,
      });
      subcategory.save(function (err, subcategory) {
        if (err) console.log(err);
        console.log("New product created");
        ProductModel.findOne({ categoryname: c1 }, (err, product) => {
          if (err) {
              console.log(err);
          } else {
              console.log(product)
              product.subcategory.push(subcategory._id)
              product.save();
              console.log(product)

              res.send({c1,s1})
          }
        })
      });
    }
  });
});





module.exports = router;