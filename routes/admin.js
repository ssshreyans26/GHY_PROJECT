const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const ProductModel = require("../model/product");
const SubCategoryModel = require("../model/subcategory");
const BrandModel = require("../model/brand.js");
const UserModel = require('../model/model');
const router = express.Router();

//When the user sends a post request to this route, passport authenticates the user based on the
//middleware created previously
router.post("/signup",passport.authenticate("adminsignup", { session: false }),
  async (req, res, next) => {
    console.log("hey");
    res.json({
      message: "Signup successful",
      user: req.user,
    });
  }
);

router.get("/signup", async (req, res, next) => {
  res.render("admin_signup");
});

router.get("/login", async (req, res, next) => {
  res.render("admin_login");
});

router.post("/login", async (req, res, next) => {
  console.log("Insiide login");
  passport.authenticate("adminlogin", async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error("An Error occurred");
        console.log(err);
        return next(error);
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        //We don't want to store the sensitive information such as the
        //user password in the token so we pick only the email and id
        const body = { _id: user._id, email: user.email };
        //Sign the JWT token and populate the payload with the user email and id
        const token = jwt.sign({ user: body }, "top_secret");
        //Send back the token to the user
        res.redirect("/adminpanel/product?secret_token=" + token);
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});



router.get("/vendor",(req,res,next)=>{
  UserModel.find(function(err,pen_vendor){
    if (err) console.log(err);
    else{
      console.log(vendor)
      res.render('admin_vendor',{vendor:vendor})
    }    
  })
})

router.post("/vendor",(req,res,next)=> {
  var approval = req.body.approval
  var userid = req.body.userid
  if(approval=="1"){
    UserModel.findById(userid,function(err,user){
      if(err) console.log(err);
      else{
        user.flag = true
        
      }
      user.save();
    });
  }
  res.send("yolo")
})


router.get("/brand", (req, res, next) => {
  console.log("inside product get");
  BrandModel.find(function(err,brand){
    if (err) console.log(err);
    if (brand) {
      console.log(brand)
      res.render("admin_brand",{brand:brand});    
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
    res.render("admin_product",{Category:product});
  })    
});


router.post("/product", async (req, res, next) => {
  console.log(req.body);
  var c1 = req.body.Category;
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
            
              product.subcategory.push(subcategory._id)
              product.save();
              console.log(product)
          }
        })
      });
    }
  });
});





module.exports = router;
