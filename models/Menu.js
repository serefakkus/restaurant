const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MenuSchema = new Schema({
    CoverImage:{
        ID:String
    },
    Items:[{
        Name:{
            type:String
        },
        Description:{
            type:String
        },
        Price:{
            type:Number,
            required:true
        },
        ImageID:{
            type:String
        },
        Materials:[
        ]

    }]
});

module.exports = mongoose.model('menu',MenuSchema);