const express = require('express');
const router = express.Router();

// models
const Franchise = require('../../models/RestaurantFranchise');
const Restaurant = require('../../models/Restaurant');
const Menu = require('../../models/Menu')

router.post('/new' ,function (req,res)  {

    let userID = req.decode.UserID

    const {name,city,province,fullAddress,latitude,longitude,explanation} = req.body

    if (typeof(name) === 'undefined' || name.length < 3 && name.length > 19 ) {
        res.status(400).send("name length must be bigger than 2 and smaller than 20")
        return;
    }

    if (typeof(city) === 'undefined' || city.length < 2 && city.length > 19  ) {
        res.status(400).send("city length must be bigger than 3 and smaller than 20")
        return;
    }

    if (typeof(province) === 'undefined' || province.length < 2 || province.length > 19 ) {
        res.status(400).send("province length must be bigger than 3 and smaller than 20")
        return;
    }

    if (typeof(fullAddress) === 'undefined' || fullAddress.length < 3 || fullAddress > 69)  {
        res.status(400).send("full adress length must be bigger than 3 and smaller than 70")
        return;
    }

    let latNumb = Number(latitude)
    let lonNumb = Number(longitude)

    if (isNaN(latNumb) || isNaN(lonNumb)) {
        res.status(400).send("coordinate must not be empty")
        return;
    }

    const franchise = new Franchise({
        FranchisesName: name,

        Address: {
            City :city,
            Province:province,
            FullAddress:fullAddress,
        },

        Explanation: explanation,

        RestaurantTypes:[],

    });

    franchise.location.type = "Point"
    franchise.location.coordinates = [lonNumb,latNumb]
    franchise.RestaurantId = userID

    const menu = new Menu({

    })

    let ok = true

    menu.save().catch(() => {
        ok = false

        res.sendStatus(500);

    }).then((men) => {

        if (ok) {
            if (!men) {
                res.sendStatus(500)
                return
            }
            franchise.Menu.ID = men._id.toHexString()
            franchise.save().catch((e) => {

                console.log("4")
                console.log(e)
                ok = false
                if (e && e.code !== 11000) {
                    res.sendStatus(500);
                    return
                }

                res.status(409).send("name is used")

            }).then((french) => {
                if (ok) {
                    Restaurant.findById(userID).catch(() => {
                        ok = false

                        res.sendStatus(500);
                    }).then((restaurant) => {
                        if (ok) {
                            if (!restaurant) {
                                res.sendStatus(404)
                                return
                            }
                            restaurant.Branches = [...restaurant.Branches,{Name:name,ID:french._id.toHexString()}]

                            Restaurant.findByIdAndUpdate(userID,{Branches:restaurant.Branches}).catch(() => {
                                ok = false
                                res.sendStatus(500)

                            }).then(() => {
                                if (ok) {
                                    res.sendStatus(200)
                                }
                            })
                        }
                    });
                }

            });
        }
    });
});


module.exports = router;
