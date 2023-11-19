const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserOrderSchema = new Schema({
    UserId: {
        type: String,
        required: true,
    },

    RestaurantId:{
      type:String,
      required: true
    },

    Items:[{
        ID:{
            type:String,
            required:true
        },
        Pieces:{
            type:Number,
            default:1
        }
    }],

    Date: {
        type:Date,
        default: Date.now
    },

    CommentId:{
        type:String
    },

    OrderStatus:{
        type:Number//0 = created , 1 = accepted , 2 = sent , 3 = completed
    }
},
{
    timestamps: true
}
);


module.exports = mongoose.model('userOrder',UserOrderSchema);