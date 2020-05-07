const passport = require('passport');
var express = require('express');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../model/model');

//Create a passport middleware to handle user registration
passport.use('signup', new localStrategy({
  usernameField : 'email',
  passwordField : 'password'
}, async (email, password, done) => {
    try {
      var flag = false
      
      //Save the information provided by the user to the the database
      const user = await UserModel.create({ email, password,flag });
      //Send the user information to the next middleware
      return done(null, user);
    } catch (error) {
      done(error);
    }
}));

//Create a passport middleware to handle User login
passport.use('login', new localStrategy({
  usernameField : 'email',
  passwordField : 'password'
}, async (email, password, done) => {

  try {
    console.log("inside passport")
    //Find the user associated with the email provided by the user
    
    const user = await UserModel.findOne({ email });
    console.log(user)
    if( !user ){
      //If the user isn't found in the database, return a message
      console.log("user not found")
      return done(null, false, { message : 'User not found'});
    }
    if(user.flag == false){
      console.log("usrer not verified")
      return done(null, false, { message : 'User not Verified by Admin'});
    }
    //Validate password and make sure it matches with the corresponding hash stored in the database
    //If the passwords match, it returns a value of true.
    console.log(password)
    const validate = await user.isValidPassword(password);
    console.log("validate="+validate)
    if( !validate ){
      console.log("wrongwa password")
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
  jwtFromRequest : ExtractJwt.fromExtractors([ExtractJwt.fromBodyField('secret_token'),ExtractJwt.fromUrlQueryParameter('secret_token')])
}, async (token, done) => {
  try {
    //Pass the user details to the next middleware
    return done(null, token.user);
  } catch (error) {
    done(error);
  }
}));