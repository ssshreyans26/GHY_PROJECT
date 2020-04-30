const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({

    categoryname : {
        type : String,
        required : true
    },
      
    subcategory : [{
            
                type:mongoose.Schema.Types.ObjectId,
                ref:"subcategory"
            
    }], 
});

const ProductModel = mongoose.model('product',ProductSchema); 
module.exports = ProductModel;