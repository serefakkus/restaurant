const express = require('express');
const router = express.Router();

const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")

// models
const Restaurant = require('../../models/Restaurant');


router.post('/signUp' ,function (req,res)  {

    const {name,pass,imageID} = req.body

    const restaurant = new Restaurant({
        Name: name,
        Pass: pass,
        PassHelper:''
    });

    if (typeof (imageID) !== 'undefined') {
        restaurant.LogoID = imageID
    }

    restaurant.Name = name;

    if (typeof(restaurant.Name) === 'undefined' || restaurant.Name.length < 4 || restaurant.Name.length > 19  ) {
        res.status(400).send("username length must be bigger than 3 and smaller than 20")
        return;
    }

    if (typeof(restaurant.Pass) === 'undefined' || restaurant.Pass.length < 6 || restaurant.Pass.length > 29  ) {
        res.status(400).send("password length must be bigger than 5 and smaller than 30")
        return;
    }

    restaurant.PassHelper = randString()

    restaurant.Pass = restaurant.Pass + restaurant.PassHelper

    bcryptjs.hash(restaurant.Pass,10).then((hash) => {
        restaurant.Pass = hash
        let ok = true;
        restaurant.save().catch((e) => {
            ok = false
            if (e && e.code !== 11000) {
                res.sendStatus(500);
                return
            }

            res.status(409).send("name is used")

        }).then(() => {
            if (ok) {
                res.sendStatus(200)
            }
        });
    });


});

function randString() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 10) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}


router.post('/signIn' ,function (req,res)  {

    let {name,pass} = req.body;

    let ok = true

    Restaurant.findOne({
        Name:name
    }).catch((e) => {
        if (e) {
            ok = false
            res.sendStatus(500)
        }
    }).then((user) => {
        if (!ok) {
            return
        }
        if (!user){
            res.status(401).send("user or password is wrong found");
            return
        }

        pass = pass + user.PassHelper

        bcryptjs.compare(pass,user.Pass).then((result) => {
            if (!result) {
                res.status(401).send("user or password is wrong");
                return
            }

            const userID = user._id.toHexString()
            const payload = {
                UserID : userID,
                Tip:0
            };

            const token = jwt.sign(payload,req.app.get('rest_api_secret_key'), {
                expiresIn: 7200
            });

            res.status(200);
            res.json({
                status: true,
                token
            });

        });
    });

});

module.exports = router;