const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
   UserName: {
      type: String,
      required:true,
      unique: true,
      minLength:4,
      maxLength:19
   },

   Pass: {
      type:String,
      required: true,
      minLength: 6
   },

   PassHelper:{
      type:String
   },

   Mail: {
      type:String,
      required:true,
      unique: true,
      maxLength: 254
   },

   Age: {
      type:Number
   },

   Gender: {
      type:String
   },

   ProfileImage: {
      type:String,
   },

});

module.exports = mongoose.model('user',UserSchema);