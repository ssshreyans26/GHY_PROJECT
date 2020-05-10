const mongoose = require('mongoose')
var CryptoJS = require("crypto-js")
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email : {
    type : String,
    required : true,
    unique : true
  },
  password : {
    type : String,
    required : true
  },
  flag : {
    type: Boolean,
    required:false
  },
  name : {
    type : String,
    required : false,
  },
  phoneno : {
    type : String,
    required : false,
    
  },
  storename : {
    type : String,
    required : false,
    
  },
  gstno : {
    type : String,
    required : false,
    
  },
    product:[{
      category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product"
      },
      subcategory:{     
       type:mongoose.Schema.Types.ObjectId,
        ref:"subcategory"
      },
      brand:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"brand"
      }
    }]
});



UserSchema.pre('save', async function(next){
  //'this' refers to the current document about to be saved
  const user = this;
  // Only is the password is modified (new password) then hash the password
  // Otherwise everytime anything you save, it'll rehash the password
  // Which is what was happening.
  if(this.isModified('password')){
  //Hash the password with a salt round of 10, the higher the rounds the more secure, but the slower
  //your application becomes.
  console.log(this.password);
  const hash = await bcrypt.hash(this.password, 10); //bcrypt js does not have direct salt rounds. 
  //Replace the plain text password with the hash and then store it
  this.password = hash;
  console.log(this.password);
  //Indicates we're done and moves on to the next middleware
}
  next();
});

//We'll use this later on to make sure that the user trying to log in has the correct credentials
UserSchema.methods.isValidPassword = async function(password){
  try{
  const user = this;
  console.log({this: this.password, password});
  //Hashes the password sent by the user for login and checks if the hashed password stored in the
  //database matches the one sent. Returns true if it does else false.
  const compare = await bcrypt.compare(password, user.password);
  console.log({compare})
  return compare;
  }
  catch(err){
    console.error(err);
  }
}

  
const UserModel = mongoose.model('user',UserSchema);
  
module.exports = UserModel;