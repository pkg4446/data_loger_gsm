const express   = require('express');
const html      = require('../html_viewer');
const router    = express.Router();

router.get('/', async function(req, res) {
    const css = html.css("/public/css/main");
    const js  = html.js("/public/js/main");
    const web_page = html.page("index",css,js);
    res.status(201).send(web_page);
});

router.get('/login', async function(req, res) {
    const css = html.css("/public/css/main") + html.css("/public/css/user");
    const js  = html.js("/public/js/login");
    let web_page = html.page("login",css,js);
    res.status(201).send(web_page);
});

router.get('/join', async function(req, res) {
    const css = html.css("/public/css/main") + html.css("/public/css/user");
    const js  = html.js("/public/js/join");
    let web_page = html.page("join",css,js);
    res.status(201).send(web_page);
});
module.exports = router;