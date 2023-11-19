const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
        UserID: {
            type: Schema.ObjectId,
            required: true,
        },

        RestaurantId:{
            type:String,
            required: true
        },

        Comment:{
            type:String,
        },

        Vote:{
          type:Number
        }
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model('comment',CommentSchema);