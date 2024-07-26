const express   = require('express');
const router    = express.Router();

const web       = require('./web');
const device    = require('./device');

router.route("/")
    .get(async function(req, res) {
        res.redirect("web/");
    })
    .post(async function(req, res) {
        const response = {header:req.headers,body:req.body}
        res.status(201).send(response);
    });
router.use('/web',web);
router.use('/device',device);

module.exports  = router;