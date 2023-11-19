const express = require('express');
const router = express.Router();

const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const validation = require('email-validator')

// models
const User = require('../../models/User');

router.post('/signUp' ,function (req,res)  {

  const {userName,pass,mail} = req.body

  const user = new User({
    UserName: userName,

    Pass: pass,

    PassHelper:'',

    Mail: mail,

  });
  user.UserName = userName;



  let isValidMail = validation.validate(mail);

  if (!isValidMail ||  typeof(mail) === 'undefined' ) {
    res.status(400).send("e-mail validation error")
    return
  }

  if (typeof(user.UserName) === 'undefined' || user.UserName.length < 4 || user.UserName.length > 19 ) {
    res.status(400).send("username length must be bigger than 3 and smaller than 20")
    return;
  }

  if (typeof(user.Pass) === 'undefined' || user.Pass.length < 6 || user.Pass.length > 29 ) {
    res.status(400).send("password length must be bigger than 5 and smaller than 30")
    return;
  }


  user.PassHelper = randString()

  user.Pass = user.Pass + user.PassHelper

  bcryptjs.hash(user.Pass,10).then((hash) => {
    user.Pass = hash
    let ok = true;
    user.save().catch((e) => {
      ok = false
      if (e && e.code !== 11000) {
        res.sendStatus(500);
        return
      }

      if (e.keyValue.Mail) {
        res.status(409).send("email is used")
        return;
      }

      res.status(409).send("username is used")

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

  let {userName,pass} = req.body;

  let ok = true

  User.findOne({
    UserName:userName
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

      const token = jwt.sign(payload,req.app.get('user_api_secret_key'), {
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