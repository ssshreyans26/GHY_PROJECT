const passport = require('passport');
var express = require('express');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../model/model');
var CryptoJS = require("crypto-js")
var bcrypt = require('bcryptjs')

//Create a passport middleware to handle user registration
passport.use('vendorsignup', new localStrategy({
  usernameField : 'email',
  passwordField : 'password'
}, async (email, password, done) => {
    try {

      
      //Save the information provided by the user to the the database
      const user = await UserModel.create({ email, password});
      // Don't use user.create (use new User)
      //Send the user information to the next middleware
      return done(null, user);
    } catch (error) {
      done(error);
    }
}));

//Create a passport middleware to handle User login
passport.use('vendorlogin', new localStrategy({
  usernameField : 'email',
  passwordField : 'password'
}, async (email, password, done) => {
  try {
    console.log("passport vendor login")
    //Find the user associated with the email provided by the user
    const user = await UserModel.findOne({ email });
    if( !user ){
      //If the user isn't found in the database, return a message
      return done(null, false, { message : 'User not found'});
    }
    //Validate password and make sure it matches with the corresponding hash stored in the database
    //If the passwords match, it returns a value of true.
    if(user.flag==false){
      return done(null, false, { message : 'You are not yet approved by admin'});
    }
    const validate = await user.isValidPassword(password);
    console.log({validate});
    if( !validate ){
      console.log("wrong password")
      return done(null, false, { message : 'Wrong Password'});
    }
    //Send the user information to the next middleware
    return done(null, user, { message : 'Logged in Successfully'});
  } catch (error) {
    return done(error);
  }
}));
    
const JWTstrategy = require('passport-jwt').Strategy;
//We use this to extract the JWT sent by the user
const ExtractJwt = require('passport-jwt').ExtractJwt;

//This verifies that the token sent by the user is valid
passport.use(new JWTstrategy({
  //secret we used to sign our JWT
  secretOrKey : 'top_secret',
  
  
  //we expect the user to send the token as a query parameter with the name 'secret_token'
  jwtFromRequest : ExtractJwt.fromExtractors([ExtractJwt.fromBodyField('secret_token'),ExtractJwt.fromUrlQueryParameter('secret_token'),ExtractJwt.fromAuthHeaderAsBearerToken(),ExtractJwt.fromHeader("Authorization")])
}, async (token, done) => {
  try {
    //Pass the user details to the next middleware
    console.log(token)
    return done(null, token.user);
  } catch (error) {
    done(error);
  }
}));