const express = require('express');
const router = express.Router();

// models
const Franchise = require('../../models/RestaurantFranchise');
const Menu = require('../../models/Menu')

router.put('/newImage' ,function (req,res)  {
    let userID = req.decode.UserID
    const {imageID} = req.body

    if (typeof (imageID) === 'undefined') {
        res.status(400).send("please insert image ID")
        return
    }

    let ok = true;

    Franchise.findById(userID).catch(() => {
        ok = false
        res.sendStatus(500)

    }).then((franc) => {
        if (ok) {
            if (franc.Menu.ID !== 'undefined'){
                Menu.findByIdAndUpdate(franc.Menu.ID,{CoverImage:imageID}).catch(() => {
                    ok =false
                    res.sendStatus(404)
                }).then(() => {
                    if (ok) {
                        res.sendStatus(200)
                    }
                });
            }
        }
    });
});

router.put('/newItems' ,function (req,res)  {
    let userID = req.decode.UserID

    const menu = new Menu({

    });

    menu.Items = req.body

    if (menu.Items.length === 0 || menu.Items) {
        res.status(400)
        return
    }

    let ok = true;

    Franchise.findById(userID).catch(() => {
        ok = false
        res.sendStatus(500)

    }).then((franc) => {
        if (ok) {
            if (franc.Menu.ID !== 'undefined'){
                Menu.findById(franc.Menu.ID).catch(() => {
                    ok =false
                    res.sendStatus(404)
                }).then((oldMenu) => {
                    if (ok) {
                        if (!oldMenu.Items) {
                            res.sendStatus(404)
                            return
                        }

                        menu.Items = [...oldMenu.Items,...menu.Items]

                        Menu.findByIdAndUpdate(franc.Menu.ID,{Items:menu.Items}).catch(() => {
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
        }
    });
});

router.delete('/delItem' ,function (req,res)  {
    let userID = req.decode.UserID
    const {index} = req.body

    let indexNumb = Number(index)

    if (isNaN(indexNumb)) {
        res.status(400).send("please insert index")
        return;
    }

    let ok = true;

    Franchise.findById(userID).catch(() => {
        ok = false
        res.sendStatus(500)

    }).then((franc) => {
        if (ok) {
            if (franc.Menu.ID !== 'undefined'){
                Menu.findById(franc.Menu.ID).catch(() => {
                    ok =false
                    res.sendStatus(404)
                }).then((menu) => {
                    if (ok) {
                        if (!menu) {
                            res.sendStatus(404)
                            return
                        }
                        if (indexNumb >= menu.Items.length || indexNumb < 0) {
                            res.status(400).send("please select invalid index")
                            return;
                        }

                        const ind = menu.Items.indexOf(indexNumb)
                        menu.Items.splice(ind,1)

                        Menu.findByIdAndUpdate(menu._id.toHexString(),{
                           Items:menu.Items
                        }).catch(() => {
                            res.sendStatus(500)
                            ok = false
                        }).then(() => {
                            if (ok) {
                                res.sendStatus(200)
                            }
                        });
                    }
                });
            }
        }
    });
});

module.exports = router;
