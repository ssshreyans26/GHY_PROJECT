var express = require('express');
var router = express.Router();
const ProductModel = require('../model/product');
const SubCategoryModel = require("../model/subcategory");
const BrandModel = require("../model/brand.js");
const UserModel = require('../model/model');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('home');
});

router.get('/customer',function(req,res,next){
  ProductModel.find().populate('subcategory').exec((err,product)=>{
    BrandModel.find((err,brand)=>{
      res.render('customer',{brand:brand,product:product})
      // res.send({product})
    })
  })  
})

router.get('/logout',function(req,res,next){
  res.redirect('/home');
})

router.post('/available',async(req,res,next)=>{
  //console.log(req.body.cname)
  UserModel.find((err,vendor)=>{
    var available = []
    vendor.forEach(element => {
      (element.product).forEach(product => {
        if(product.category==req.body.cname&&product.subcategory==req.body.sname&&product.brand==req.body.bname){
          
          available.push(vendor)
          
        }
        
      });
      
    });
    res.send(available)
  })


})

module.exports = router;


