const express = require('express');
const router = express.Router();

const jwt = require("jsonwebtoken")

// models
const Restaurant = require('../../models/Restaurant');

router.get('/getAll' ,function (req,res)  {
    let userID = req.decode.UserID

    let ok = true
    Restaurant.findById(userID).catch(() => {
        ok = false

        res.sendStatus(500);
    }).then((restaurant) => {
        if (ok) {
            if (!restaurant) {
                res.sendStatus(404)
                return
            }
            res.status(200).json(restaurant.Branches)
        }
    });
});

router.post('/sel' ,function (req,res)  {
    let userID = req.decode.UserID

    let {index} = req.body;

    let indexNumb = Number(index)

    if (isNaN(indexNumb)) {
        res.status(400).send("please select frenchise (index:Number)")
        return
    }

    let ok = true

    Restaurant.findById(
        userID
    ).catch((e) => {
        if (e) {

            ok = false
            res.sendStatus(500)
        }
    }).then((user) => {
        if (!ok) {
            return
        }
        if (!user){
            res.status(404).send("Restaurant not found");
            return
        }

        if (indexNumb >= user.Branches.length) {
            res.status(400).send("please valid franchise (index is longer than franchise length)")
            return
        }

        const frenchId = user.Branches[indexNumb].ID
        const payload = {
            UserID : frenchId,
            Tip:2
        };

        const token = jwt.sign(payload,req.app.get('fran_api_secret_key'), {
            expiresIn: 720
        });

        res.status(200);
        res.json({
            status: true,
            token
        });

    });


});


module.exports = router;