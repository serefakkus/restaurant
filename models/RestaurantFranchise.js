const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RestaurantFranchiseSchema = new Schema({
    FranchisesName: {
        type: String,
        required:true,
        unique: true
    },

    Address: {
        City :{
            type:String,
            required: true,
        },
        Province:{
            type:String,
            required: true,
        },
        FullAddress:{
            type:String,
            required:true
        },
    },

    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number]
        }
    },

    Menu:{
        ID:String
    },

    RestaurantId:{
        type:String
    },

    Vote:{
        Average:Number,
        Count:Number
    },

    Explanation: {
        type: String
    },

    RestaurantTypes:[],
});


RestaurantFranchiseSchema.index({ location: "2dsphere" });

module.exports = mongoose.model('restaurantFranchise',RestaurantFranchiseSchema);