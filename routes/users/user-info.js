const express = require('express');
const router = express.Router();


// models
const User = require('../../models/User');

router.put('/refInfo' ,function (req,res)  {
    const {age,gender} = req.body
    let userID = req.decode.UserID

    let ageNumb = Number(age)
    if (ageNumb < 1 || isNaN(ageNumb)) {
        res.status(400).send("age must be number")
        return
    }

    let ok = true

    User.findByIdAndUpdate(userID,{Gender:gender,Age:ageNumb}).catch((e) => {
          ok = false

          res.sendStatus(500);
         console.log(e)
    }).then(() => {
         if (ok) {
            res.sendStatus(200)
        }
    });
});

module.exports = router;