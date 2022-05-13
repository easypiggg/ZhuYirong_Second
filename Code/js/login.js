//获取元素
const page=document.getElementById('page');
const loginpage=document.getElementById('loginpage')
const go_login=document.querySelector('.register').querySelector('.go-login');
const go_register=document.querySelector('.login').querySelector('.go-register');
const register_form=document.querySelector('.register-form');
const login_btn=document.querySelector('.login-btn');
const register_btn=document.querySelector('.registr-btn');
//跳转注册表单
go_register.onclick=function() {
    login_form.style.display='none';
    register_form.style.display='block';
} 
go_login.onclick=function() {
    login_form.style.display='block';
    register_form.style.display='none';
}

const username=document.querySelector('#username');
const password=document.querySelector('#password');
const login_form=document.querySelector('.login-form'); 
const btn=document.querySelector('.btn');
// 设置登录用户id
// var myId;
let storage=window.localStorage;

login_btn.onclick=function() {
    ajax({
        url : "http://175.178.193.182:8080/login",  
        type : "POST",  
        async : false,   
        data : { 
            username:username.value,
            password:password.value
        },
        success : function(data){ 
            console.log(data);
            if(data.status===200) {    
                let dataValue=JSON.stringify(data.userId);
                storage.setItem('myId',dataValue);
                loginpage.style.display='none';
                page.style.display='block';
            }else {
                alert('账号或密码错误');
            }
        }
    })
}
let myIdString=storage.getItem('myId');
let myId=JSON.parse(myIdString);

// 登出按钮
const logout=personcenter.querySelector('.logout');
logout.onclick=function() {
     ajax ({
        url:"http://175.178.193.182:8080/logout",
        type:"POST",
        async:true,
        data:{
            userId:myId
        },
        success:function(data) {
            console.log(data);
            loginpage.style.display='block';
            loginpage.style.transition='3s';
            page.style.display='none';
            homepage.style.display='block';
            personcenter.style.display='none';
            p_center.className='';
            h_page.className='current';
        }
    }) 
}
