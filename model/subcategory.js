const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const SubcategorySchema = new Schema({
    subcategoryname : {
        type : String,
        required : true
    } 
});

const SubcategoryModel = mongoose.model('subcategory',SubcategorySchema);
  
module.exports = SubcategoryModel;