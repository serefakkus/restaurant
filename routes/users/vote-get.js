const express = require('express');
const router = express.Router();


// models
const Vote = require('../../models/Vote');

router.get('/get' ,function (req,res)  {

    const {page} = req.body

    let pageNumber = Number(page)
    if (isNaN(pageNumber) || pageNumber < 1) {
        pageNumber = 0
    } else {
        pageNumber = pageNumber-1
    }
    let ok = true
    Vote.aggregate([
        {
            $sort: {
                createdOn : -1
            }
        },
        {
            $lookup: {
                from:'users',
                localField:'UserID',
                foreignField:'_id',
                as:'user'
            },
        },
        {
          $project: {
              usersName:{
                  $filter:
                      {
                          input: "$user",
                          as: "user",
                          cond: { $eq: [ "$$user.Gender", 'm' ] }
                      }
              }
          }
        },
        { "$limit": 20 },
        { "$skip": pageNumber * 20 }
        ]).catch((e) => {
        console.log(e)
        ok = false

        res.sendStatus(500);
    }).then((vote) => {
        if (ok) {
            if (vote.length > 0) {
                let response = []
                vote.forEach((e) => {
                    if (typeof (e.usersName) !== 'undefined') {
                        if (typeof (e.usersName[0]) !== 'undefined'){
                            response.push(e.usersName[0].UserName)
                        }
                    }
                });

                res.status(200).json(response)
                return
            }

            res.sendStatus(204)
        }
    });
});

module.exports = router;
