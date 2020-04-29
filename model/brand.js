const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const BrandSchema = new Schema({ 
    Brandname : {
        type : String,
        required : true
    },
      
});

const BrandModel = mongoose.model('brand',BrandSchema);
  
module.exports = BrandModel;