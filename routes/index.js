const express   = require('express');
const router    = express.Router();

const web       = require('./web');
const device    = require('./device');

router.get('/', async function(req, res) {
    res.redirect("/web/");
});
router.use('/web',web);
router.use('/device',device);

module.exports  = router;