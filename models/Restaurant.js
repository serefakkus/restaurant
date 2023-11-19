const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
    Name: {
        type: String,
        required:true,
        unique: true
    },

    LogoID: {
        type:String
    },

    Pass:{
        type:String,
        required: true,
        minLength: 6
    },

    PassHelper:{
        type:String
    },
    Branches: [{
            Name:String,
            ID : String
    }],

});

module.exports = mongoose.model('restaurant',RestaurantSchema);