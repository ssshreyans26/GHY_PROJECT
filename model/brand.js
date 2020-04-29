const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const BrandSchema = new Schema({ 
    brandname : {
        type : String,
        required : true
    },
      
});

const BrandModel = mongoose.model('brand',BrandSchema);
  
module.exports = BrandModel;