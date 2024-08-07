const crypto        = require("crypto");
const express       = require('express');
const file_system   = require('../fs_core');
const mqtt          = require('../mqtt');
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
    if(join_data.id!=undefined && join_data.pass!=undefined && join_data.check!=undefined){
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

router.post('/connect', async function(req, res) {
    let status_code = 400;
    let response    = "nodata";
    const user_data = req.body;
    if(user_data.id!=undefined && user_data.token!=undefined && user_data.dvid!=undefined && user_data.name!=undefined && user_data.name.length>0){
        user_data.name = user_data.name.replaceAll(' ',"_");
        const   path_user   = "./data/user/"+user_data.id;
        const   path_device = "./data/device/"+user_data.dvid;
        if(file_system.check(path_user+"/login.txt")){
            if(file_system.check(path_user) && file_system.fileRead(path_user,"login.txt")==user_data.token){
                if(file_system.check(path_device)){
                    if(file_system.check(path_device+"/owner.txt")){
                        status_code = 409;
                        response    = "duplication";
                    }else{
                        status_code = 200;
                        response    = "success";
                        const file_content = file_system.fileRead(path_user,"device.csv");
                        if(file_content){
                            const devices  = file_content.split("\r\n");
                            let device_duplication = false;
                            for (let index = 0; index < devices.length; index++) {
                                if(devices[index] == user_data.dvid){
                                    device_duplication = true;
                                    break;
                                }
                            }
                            if(!device_duplication) file_system.fileADD(path_user,user_data.dvid+","+user_data.name+"\r\n","device.csv");
                        }else{
                            file_system.fileMK(path_user,user_data.dvid+","+user_data.name+"\r\n","device.csv");
                        }
                        file_system.fileMK(path_device,user_data.id,"owner.txt")
                    }
                }else{
                    status_code = 403;
                    response    = "device";
                }
            }else{
                status_code = 401;
                response    = "user";
            }
        }else{
            status_code = 401;
            response    = "user";
        }
    }
    res.status(status_code).send(response);
});

router.post('/list', async function(req, res) {
    let status_code = 400;
    let response    = "nodata";
    const user_data = req.body;
    if(user_data.id!=undefined && user_data.token!=undefined){
        const   path_user   = "./data/user/"+user_data.id;
        if(file_system.check(path_user+"/login.txt")){
            if(file_system.check(path_user) && file_system.fileRead(path_user,"login.txt")==user_data.token){
                if(file_system.check(path_user+"/device.csv")){
                    status_code = 200;
                    response    = file_system.fileRead(path_user,"device.csv");
                }else{
                    status_code = 403;
                    response    = "device";
                }
            }else{
                status_code = 401;
                response    = "user";
            }
        }else{
            status_code = 401;
            response    = "user";
        }
    }
    res.status(status_code).send(response);
});

router.post('/log', async function(req, res) {
    let status_code = 400;
    let response    = "nodata";
    const user_data = req.body;
    if(user_data.id!=undefined && user_data.token!=undefined && user_data.dvid!=undefined && user_data.date!=undefined){
        const   path_user   = "./data/user/"+user_data.id;
        const   path_device = "./data/device/"+user_data.dvid;
        if(file_system.check(path_user+"/login.txt")){
            if(file_system.check(path_user) && file_system.fileRead(path_user,"login.txt")==user_data.token){
                if(file_system.check(path_device+"/owner.txt")&&(file_system.fileRead(path_device,"owner.txt")==user_data.id)){
                    status_code = 200;
                    response    = "ok";
                    if(user_data.date[1]<10){
                        const temp_num = user_data.date[1];
                        user_data.date[1] = "0"+temp_num;
                    }
                    let yesterday = user_data.date[2]-1;
                    if(user_data.date[2]<10){
                        const temp_num = user_data.date[2];
                        user_data.date[2] = "0"+temp_num;
                        yesterday = "0"+(temp_num-1);
                    }
                    if(file_system.check("./data/device/"+user_data.dvid+"/"+user_data.date[0]+"/"+user_data.date[1]+"/"+user_data.date[2]+".csv")){
                        response    = "log\r\n";
                        if(file_system.check("./data/device/"+user_data.dvid+"/"+user_data.date[0]+"/"+user_data.date[1]+"/"+yesterday+".csv")){
                            response    += file_system.fileRead("./data/device/"+user_data.dvid+"/"+user_data.date[0]+"/"+user_data.date[1],yesterday+".csv");
                        }
                        response    += file_system.fileRead("./data/device/"+user_data.dvid+"/"+user_data.date[0]+"/"+user_data.date[1],user_data.date[2]+".csv");
                    }else{
                        let latest_path = "./data/device/"+user_data.dvid;
                        let log_dir     = file_system.Dir(latest_path);
                        if(log_dir.length>2){
                            if(file_system.check(latest_path+"/"+user_data.date[0])){latest_path+="/"+user_data.date[0]}
                            else if(file_system.check(latest_path+"/"+(user_data.date[0]-1))){latest_path+="/"+user_data.date[0]-1}
                            else{response = "null";}
                            if(response != "null"){
                                log_dir = file_system.Dir(latest_path);
                                if(log_dir.length>0){
                                    latest_path += "/"+log_dir[log_dir.length-1];
                                }
                                log_dir = file_system.Dir(latest_path);
                                if(log_dir.length>0){
                                    response = "log\r\n"+file_system.fileRead(latest_path,log_dir[log_dir.length-1]);
                                }else{
                                    response = "null";
                                }
                            }
                        }else{
                            response = "null";
                        }
                    }
                }else{
                    status_code = 403;
                    response    = "device";
                }
            }else{
                status_code = 401;
                response    = "user";
            }
        }else{
            status_code = 401;
            response    = "user";
        }
    }
    res.status(status_code).send(response);
});

router.post('/config', async function(req, res) {
    let status_code = 400;
    let response    = "nodata";
    const user_data = req.body;
    console.log(user_data);
    if(user_data.id!=undefined && user_data.token!=undefined && user_data.dvid!=undefined){
        const   path_user   = "./data/user/"+user_data.id;
        const   path_device = "./data/device/"+user_data.dvid;
        if(file_system.check(path_user+"/login.txt")){
            if(file_system.check(path_user) && file_system.fileRead(path_user,"login.txt")==user_data.token){
                if(file_system.check(path_device+"/owner.txt")&&(file_system.fileRead(path_device,"owner.txt")==user_data.id)){
                    status_code = 200;
                    response    = file_system.fileRead(path_device,"config.json");
                }else{
                    status_code = 403;
                    response    = "device";
                }
            }else{
                status_code = 401;
                response    = "user";
            }
        }else{
            status_code = 401;
            response    = "user";
        }
    }
    res.status(status_code).send(response);
});

router.post('/cmd', async function(req, res) {
    let status_code = 400;
    let response    = "nodata";
    const user_data = req.body;
    if(user_data.id!=undefined && user_data.token!=undefined && user_data.dvid!=undefined){
        const   path_user   = "./data/user/"+user_data.id;
        const   path_device = "./data/device/"+user_data.dvid;
        if(file_system.check(path_user+"/login.txt")){
            if(file_system.check(path_user) && file_system.fileRead(path_user,"login.txt")==user_data.token){
                if(file_system.check(path_device+"/owner.txt")&&(file_system.fileRead(path_device,"owner.txt")==user_data.id)){
                    status_code = 200;
                    response    = "ok";
                    let command = [];
                    if(user_data.type == 'irrigation'){
                        if(user_data.data[0][0]!=''){
                            command.push("set water run "+user_data.data[0][0]+"\n");
                        }
                        if(user_data.data[0][1]!=''){
                            command.push("set water stp "+user_data.data[0][1]+"\n");
                        }
                        if(user_data.data[1][0]!=''){
                            command.push("set liquid run "+user_data.data[1][0]+"\n");
                        }
                        if(user_data.data[1][1]!=''){
                            command.push("set liquid stp "+user_data.data[1][1]+"\n");
                        }
                    }else if(user_data.type == 'lighting'){
                        for (let index = 0; index < user_data.data.length; index++) {
                            const tartget = String.fromCharCode(97+index);
                            if(user_data.data[index][0]!=''){
                                command.push("set lamp_"+tartget+" run "+parseInt(user_data.data[index][0].split(':')[0])+"\n");
                            }
                            if(user_data.data[index][1]!=''){
                                command.push("set lamp_"+tartget+" stp "+parseInt(user_data.data[index][1].split(':')[0])+"\n");
                            }
                        }
                    }else if(user_data.type == 'temperature'){
                        if(user_data.data.target!=''){
                            command.push("set temp run "+user_data.data.target+"\n");
                        }
                        if(user_data.data.tolerance!=''){
                            command.push("set temp stp "+user_data.data.tolerance+"\n");
                        }
                    }else if(user_data.type == 'airConditioning'){
                        if(user_data.data[0][0]!=''){
                            command.push("set circul_i run "+user_data.data[0][0]+"\n");
                        }
                        if(user_data.data[0][1]!=''){
                            command.push("set circul_i stp "+user_data.data[0][1]+"\n");
                        }
                        if(user_data.data[1][0]!=''){
                            command.push("set circul_o run "+user_data.data[1][0]+"\n");
                        }
                        if(user_data.data[1][1]!=''){
                            command.push("set circul_o stp "+user_data.data[1][1]+"\n");
                        }
                        console.log(command);
                    }else if(user_data.type == 'houseControl'){
                        if(user_data.data == "open"){
                            command.push("wing on\n");
                        }else if(user_data.data == "close"){
                            command.push("wing off\n");
                        }
                    }
                    if(command.length > 0){
                        for (let index = 0; index < command.length; index++) {
                            const mqtt_cmd = {
                                TARGET:  user_data.dvid,
                                COMMEND: command[index]
                            };
                            mqtt.send(mqtt_cmd);
                        }
                    }
                    else{response = "null"}
                    
                }else{
                    status_code = 403;
                    response    = "device";
                }
            }else{
                status_code = 401;
                response    = "user";
            }
        }else{
            status_code = 401;
            response    = "user";
        }
    }
    res.status(status_code).send(response);
});

module.exports = router;