const user_config = {
    user:localStorage.getItem('user'),
    token:localStorage.getItem('token')
}
if(user_config.user!=null&&user_config.token!=null){
    alert(user_config.user+","+user_config.token);
}else{
    window.location.href = '/web/login';
}