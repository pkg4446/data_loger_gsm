const express   = require('express');
const router    = express.Router();

const device    = require('./device');
router.use('/device',device);

module.exports  = router;