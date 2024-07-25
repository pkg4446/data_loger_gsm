const express       = require('express');
const file_system   = require('./fs_core');
const index_router  = require('./routes');

const path_user     = "./data/user";

if(!file_system.check(path_user)) file_system.folderMK(path_user);

const app   = express();
const port  = 3002;

app.use(favicon(path.join(__dirname, '/public', 'favicon.ico')));
app.use(express.json());
app.use('/', index_router);

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});