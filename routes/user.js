const crypto        = require("crypto");
const express       = require('express');
const file_system   = require('../fs_core');
const router        = express.Router();

router.post('/login', async function(req, res) {
    let status_code  = 400;
    let response     = "nodata";
    const login_data = req.body;
    if(login_data.id!=undefined&&login_data.pass!=undefined){
        const path_user = "./data/user/"+login_data.id;
        if(file_system.check(path_user+"/config.csv")){
            const user_config = file_system.fileRead(path_user,"config.csv").split(",");
            if(crypto.createHash("sha256").update(login_data.pass+user_config[0]).digest("base64") == user_config[1]){
                status_code     = 200;
                const loginfo   = crypto.randomBytes(16).toString('hex');
                file_system.fileMK(path_user,loginfo,"login.txt");
                response        = loginfo;
            }else{
                status_code = 403;
                response    = "password";
            }
        }else{
            status_code = 406;
            response    = "userid";
        }
    }
    res.status(status_code).send(response);
});

router.post('/join', async function(req, res) {
    let status_code = 400;
    let response    = "nodata";
    const join_data = req.body;
    if(join_data.id!=undefined&&join_data.pass!=undefined&&join_data.check!=undefined){
        status_code = 403;
        response    = "password";
        const   path_user = "./data/user/"+join_data.id;
        if(file_system.check(path_user)){
            status_code = 406;
            response    = "userid";
        }else if(join_data.pass == join_data.check){
            status_code = 200;
            response    = "success";
            file_system.folderMK(path_user);
            const randombyte = crypto.randomBytes(4).toString('hex');
            let file_content = randombyte+","+crypto.createHash("sha256").update(join_data.pass+randombyte).digest("base64")+","+(new Date())+"\r\n";
            file_system.fileMK(path_user,file_content,"config.csv");
        }
    }
    res.status(status_code).send(response);
});

module.exports = router;