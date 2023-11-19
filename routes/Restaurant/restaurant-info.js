const express = require('express');
const router = express.Router();


// models
const Restaurant = require('../../models/Restaurant');

router.put('/refLogo' ,function (req,res)  {
    const {imageId } = req.body

    let userID = req.decode.UserID

   if (typeof (imageId) === 'undefined') {
       res.status(400).send("please insert Logo ID")
       return;
   }

    Restaurant.findByIdAndUpdate(userID,{LogoID:imageId}).catch((e) => {
        if (e && e.code !== 11000) {
            res.sendStatus(500);
        }
    }).then(() => {
        res.sendStatus(200)
    });
});

module.exports = router;