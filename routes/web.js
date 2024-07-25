const express   = require('express');
const html      = require('../html_viewer');
const router    = express.Router();

router.get('/', async function(req, res) {
    let web_page = html.page("index");
    res.status(201).send(web_page);
});

router.get('/user', async function(req, res) {
    let web_page = html.page("index");
    res.status(201).send(web_page);
});

module.exports = router;