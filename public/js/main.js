if(localStorage.getItem('user')!=null && localStorage.getItem('token')!=null){
    if(localStorage.getItem('device') === null){
        window.location.href = '/web/select';
    }
    console.log(localStorage.getItem('user'),localStorage.getItem('token'),localStorage.getItem('device'));
}else{
    window.location.href = '/web/login';
}