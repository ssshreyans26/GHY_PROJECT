const express = require('express');
const ProductModel = require('../model/product');
const SubCategoryModel = require("../model/subcategory");
const BrandModel = require("../model/brand.js");
const UserModel = require('../model/model');
const checkauth = require('../auth/check-auth')
const router = express.Router();
const passport = require('passport');

const {format} = require('util');
// const googleStorage = require('@google-cloud/storage');
const Multer = require('multer');
const {Storage} = require('@google-cloud/storage');
const storage =new Storage({
  projectId: "ghy-project-276107",
  keyFilename: "ghy-project-276107-firebase-adminsdk-o5dfk-ef8aeea7a9.json"
});

const bucket = storage.bucket("gs://ghy-project-276107.appspot.com");

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  }
});
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

router.get('/vendor_details',passport.authenticate('jwt', { session : false }),async(req,res,next) => {
  res.render('vendor_details',{secret_token:req.query.secret_token});
});

router.post('/vendor_details',checkauth,multer.single('file'),async(req,res,next)=>{

  // console.log(req.file)
  // console.log({file})
  console.log(req.file)
  let file = req.file;
  let uid = req.user._id
  console.log("post details")
  // console.log(file)
  if (file) {
    console.log("upload function will be executed")
    uploadImageToStorage(file).then((success) => {
      // res.status(200).send({
      //   status: 'success'
      // });
      console.log("success")
      res.send("file uploaded")
    }).catch((error) => {
      console.error(error);
    });
  }
  
});

router.get('/vendor_products',passport.authenticate('jwt', { session : false }),async(req,res,next)=>{
  // var brand = BrandModel.find()

    ProductModel.find().populate('subcategory').exec((err,product)=>{
    BrandModel.find(function(err,brand){
      res.render('vendor_product',{Category:product,Brand:brand,secret_token:req.query.secret_token});
    })
  })    
})

router.post('/vendor_products',passport.authenticate('jwt', { session : false }),(req,res,next)=>{
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
     if(pflag!=1){

    vendor.product.push(newproduct),
     vendor.save();
     console.log(vendor)
     res.send(vendor.product)
      }
    })
});


const uploadImageToStorage = (file) => {
  console.log("inside file upload")
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No image file');
    }
    console.log("you are here")
    let newFileName = `${file.originalname}_${Date.now()}`;
    console.log({newFileName})
    let fileUpload = bucket.file(newFileName);
    console.log({fileUpload})
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    blobStream.on('error', (error) => {
      console.log({error})
      reject('Something is wrong! Unable to upload at the moment.');
    });

    blobStream.on('finish', () => {
      // The public URL can be used to directly access the file via HTTP.
      var x = bucket.name
      console.log(x)
      const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
      console.log(url)
      resolve(url);
      
    });

    blobStream.end(file.buffer);
  });
}


module.exports = router;