const express           = require('express');
const router            = express.Router();

const user_interface    = require('./user_interface');
router.use('/',user_interface);
const device            = require('./device');
router.use('/device',device);

module.exports  = router;