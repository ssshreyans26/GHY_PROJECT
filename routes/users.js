var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
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
      res.render('vendor_product',{Category:product,Brand:brand});
    })
  })    
})

router.post('/vendor_products',async(req,res,next)=>{
  UserModel.find()
});


module.exports = router;
