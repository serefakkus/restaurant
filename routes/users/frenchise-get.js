const express = require('express');
const router = express.Router();

// models
const Franchise = require('../../models/RestaurantFranchise');


router.get('/getAll' ,function (req,res)  {
    const {page} = req.body
    let pageNumber = Number(page)

    if (isNaN(pageNumber) || pageNumber < 1) {
        pageNumber = 0
    } else {
        pageNumber = pageNumber -1
    }

    let ok = true
    Franchise.find({}).sort({'Vote.Average' : -1}).limit(8).skip(pageNumber * 8).catch(() => {
        ok = false

        res.sendStatus(500);
    }).then((restaurants) => {
        if (ok) {
            if (restaurants.length > 0) {
                res.status(200).json(restaurants)
                return
            }

            res.sendStatus(204)
        }
    });
});

router.get('/get' ,function (req,res)  {
    let {keyWord} = req.body

    if (typeof (keyWord) === 'undefined') {
        req.status(400).send("please insert keyWord")
        return
    }

    keyWord = '/' + keyWord + '/i'

    const urlObject = new URL(req.url);
    const restaurantTypeArray = urlObject.searchParams.get('restaurantTypes').split(',');



    let ok = true
    Franchise.find({$and:[{Vote:{Average:{$gt:4}}},{$or:[{Explanation:{$regex:keyWord}},{RestaurantTypes:{$in:restaurantTypeArray}}]}]})
        .select('FranchisesName Explanation RestaurantTypes').catch(() => {
        ok = false

        res.sendStatus(500);
    }).then((restaurants) => {
        if (ok) {
            if (restaurants.length > 0) {
                res.status(200).json(restaurants)
                return
            }

            res.sendStatus(204)
        }
    });
});

module.exports = router;
