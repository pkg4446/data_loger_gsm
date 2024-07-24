const express       = require('express');
const file_system   = require('../fs_core');
const router        = express.Router();
const requestIp     = require('request-ip');

router.post('/log', async function(req, res) {    
    const IP  = requestIp.getClientIp(req);
    console.log(IP,req.body);

    const path_device   = "./data/device/"+req.body.DEVID;
    const date_now      = new Date();
    let file_content    = date_now+","+req.body.t_w+","+req.body.t_l+","+req.body.t_a+","+req.body.t_o+"\r\n";
    let filename        = "";
    
    filename += date_now.getFullYear();
    if(date_now.getMonth()<10) filename += "0";
    filename += date_now.getMonth();
    filename += date_now.getDate();
   
    if(!file_system.check(path_device+"/log")) file_system.folderMK(path_device+"/log");
    file_system.fileMK(path_device,IP+"\r\n","ip");
    if(file_system.check(path_device+"/log/"+filename+".csv")){
        file_system.fileADD(path_device+"/log/",file_content,filename);
    }else{
        file_system.fileMK(path_device+"/log/",file_content,filename);
    }
    res.status(201).send("ack");
});
router.post('/refresh', async function(req, res) {    
    const IP  = requestIp.getClientIp(req);
    console.log(IP,req.body);
    res.status(201).send("ack");
});

module.exports = router;