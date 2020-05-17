var express = require('express');
var router = express.Router();
const ProductModel = require('../model/product');
const SubCategoryModel = require("../model/subcategory");
const BrandModel = require("../model/brand.js");
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



module.exports = router;
