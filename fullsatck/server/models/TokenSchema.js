


const mongoose = require('mongoose');


const tokenSchema=new mongoose.Schema({
    token:{
      type:String,
      required:true
    },
    userId:{
      type:Number,
      required:true
    }},
    {
      timestamps: true 
    }); 
  
  
  const Token=mongoose.model('Token',tokenSchema)
  

module.exports = Token;