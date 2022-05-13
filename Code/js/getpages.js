// 获取首页文章列表
// 首页的各个页面
function pageItem(page,box) {
    for(let i=0;i<page.length;i++) {
        var div=item.cloneNode(true);
        div.id='';
        box.appendChild(div);
        var p=new Item(div);
        p.itemShow(page[i]);       
    }
    const imgsbox=box.getElementsByClassName('item-img');
    const imgs=box.getElementsByClassName('item-images');
    for(let j=0;j<imgs.length;j++) {
        pageTop=imgsbox[j].offsetTop+80;
        if(pageTop<window.innerHeight) {
            imgs[j].src=imgs[j].getAttribute('data-src');
        }
    }
    // 首页图片懒加载
    window.onscroll=throttle(lazyLoad,250);
    function lazyLoad() {
        let height=window.innerHeight;
        let scrollTop=document.body.scrollTop||document.documentElement.scrollTop;
        for(let j=0;j<imgs.length;j++) {
            pageTop=imgsbox[j].offsetTop+80;
            if(pageTop<scrollTop+height) {
                imgs[j].src=imgs[j].getAttribute('data-src');
            }
        }
    }
}

//item点击跳转详情页 事件委托函数
function pageBtn(box,returnpage) {
    let boxdivs=box.getElementsByClassName('item');
    let boxArr=Array.prototype.slice.call(boxdivs);
    box.onclick=function(e) {
        let target=e.target;
        let i;
        if(boxArr.indexOf(target.parentNode)===-1) {
            i=boxArr.indexOf(target.parentNode.parentNode);
        }else {
            i=boxArr.indexOf(target.parentNode);
        }
        if(target.className=='item-likes iconfont'||target.className=='item-num') {
            i=boxArr.indexOf(target.parentNode.parentNode.parentNode);
        }
        page.style.display='none';
        item_detail.style.display='block';
        articleShow(returnpage[i]);
    }
}


// 赞与收藏页面
const mlikes_page=document.querySelector('.mlikes-page');
const mlikes_back=document.querySelector('.mlikes-back');
// 获赞页面添加
const likeperson=document.querySelector('.likeperson');
const likeperson_btn=document.querySelector('.likeperson-btn');
// 收藏页面添加
const starperson=document.querySelector('.starperson');
const starperson_btn=document.querySelector('.starperson-btn');
// 获得的赞页面
function getLikes(btn,userId) {
    mlikes_back.onclick=function() {
        page.style.display='block';
        mlikes_page.style.display='none';
        likeperson_btn.className='current likeperson-btn';
        starperson_btn.className='starperson-btn';
    }
    btn.onclick=function() {
        var userhp_format=document.getElementsByClassName('userhp-format');
        for(let i=0;i<userhp_format.length;i++) {
            userhp_format[i].style.display='none';
        }
        page.style.display='none';
        mlikes_page.style.display='block';
        starperson.innerHTML='';
        likeperson.innerHTML='';
        // 喜欢的页面
        ajax({
            url:"http://175.178.193.182:8080/notice/article/like",
            type:"GET",
            async:true,
            data: {
                userId:userId
            },
            success:function(data) {
                console.log(data);
                for(let i=0;i<data.like.length;i++) {
                    var div=likenote_format.cloneNode(true);
                    div.id='';
                    div.style.display='block';
                    var p=new Likenote(div);
                    p.likenoteShow(data.like[i]);
                    likeperson.appendChild(div);
                    p.description.innerHTML='赞了你的笔记';
                }
            }
        })
    }
    // 收藏的页面
    starperson_btn.onclick=function() {
        starperson.innerHTML='';
        likeperson.innerHTML='';
        this.className='current starperson-btn';
        likeperson_btn.className='likeperson-btn';
        ajax({
            url:"http://175.178.193.182:8080/notice/article/star",
            type:"GET",
            async:true,
            data: {
                userId:userId
            },
            success:function(data) {
                console.log(data);
                for(let i=0;i<data.star.length;i++) {
                    var div=likenote_format.cloneNode(true);
                    div.id='';
                    div.style.display='block';
                    var p=new Likenote(div);
                    p.likenoteShow(data.star[i]);
                    starperson.appendChild(div);
                    p.description.innerHTML='收藏了你的笔记';
                    starperson.appendChild(div);
                }
            }
        })
    }
    // 喜欢的页面
    likeperson_btn.onclick=function() {
        starperson.innerHTML='';
        likeperson.innerHTML='';
        this.className='current likeperson-btn';
        starperson_btn.className='starperson-btn';
        ajax({
            url:"http://175.178.193.182:8080/notice/article/like",
            type:"GET",
            async:true,
            data: {
                userId:userId
            },
            success:function(data) {
                console.log(data);
                for(let i=0;i<data.like.length;i++) {
                    var div=likenote_format.cloneNode(true);
                    div.id='';
                    div.style.display='block';
                    var p=new Likenote(div);
                    p.likenoteShow(data.like[i]);
                    likeperson.appendChild(div);
                    p.description.innerHTML='赞了你的笔记';
                    likeperson.appendChild(div);
                }
            }
        })
    }
}

// 获取粉丝页面
const mfocus_page=document.querySelector('.mfocus-page');
const mfocus_back=document.querySelector('.mfocus-back');
const focusperson=document.querySelector('.focusperson');
function getFans(btn,userId) {
    mfocus_back.onclick=function() {
        page.style.display='block';
        mfocus_page.style.display='none';
    }
    btn.onclick=function() {
        var userhp_format=document.getElementsByClassName('userhp-format');
        for(let i=0;i<userhp_format.length;i++) {
            userhp_format[i].style.display='none';
        }
        page.style.display='none';
        mfocus_page.style.display='block';
        focusperson.innerHTML='';
        ajax({
            url:"http://175.178.193.182:8080/user/fanList",
            type:"GET",
            async:true,
            data: {
                userId:userId
            },
            success:function(data) {
                console.log(data);
                for(let i=0;i<data.fansList.length;i++) {
                    var div=user.cloneNode(true);
                    div.id='';
                    div.style.display='block';
                    var p=new User(div);
                    p.userShow(data.fansList[i]);
                    p.description.innerHTML='';
                    focusperson.appendChild(div);
                }
                // 关注按钮
                for(let i=0;i<focusperson.children.length;i++) {
                    focusperson.children[i].onclick=function(e) {
                        if(e.target.className=='user-focus') {
                            // 关注别人
                            if(e.target.innerHTML==='未关注') {
                                ajax({
                                    url:"http://175.178.193.182:8080/user/follow",
                                    type:"POST",
                                    async:true,
                                    data: {
                                        userId:myId,
                                        followerId:data.fansList[i].userId
                                    },
                                    success:function(data) {
                                        e.target.innerHTML='已关注';
                                    }
                                })
                            }else {
                                ajax({
                                    url:"http://175.178.193.182:8080/user/cancelFollow",
                                    type:"POST",
                                    async:true,
                                    data: {
                                        userId:myId,
                                        followerId:data.fansList[i].userId
                                    },
                                    success:function(data) {
                                        e.target.innerHTML='未关注';
                                    }
                                })
                            }
                        }
                    }
                }
            }
        })
    }
}

// 关注的人页面
const focus_page=document.querySelector('.focus-page');
const focus_back=document.querySelector('.focus-back');
const myfocusperson=document.querySelector('.myfocusperson');
function getFollows(btn,userId) {
    focus_back.onclick=function() {
        page.style.display='block';
        focus_page.style.display='none';
    }
    btn.onclick=function() {
        var userhp_format=document.getElementsByClassName('userhp-format');
        for(let i=0;i<userhp_format.length;i++) {
            userhp_format[i].style.display='none';
        }
        page.style.display='none';
        focus_page.style.display='block';
        myfocusperson.innerHTML='';
        ajax({
            url:"http://175.178.193.182:8080/user/followerList",
            type:"GET",
            async:true,
            data: {
                userId:userId
            },
            success:function(data) {
                console.log(data);
                for(let i=0;i<data.followsList.length;i++) {
                    var div=user.cloneNode(true);
                    div.id='';
                    div.style.display='block';
                    var p=new User(div);
                    p.userShow(data.followsList[i]);
                    p.description.innerHTML='';
                    myfocusperson.appendChild(div);
                }
                // 关注按钮
                for(let i=0;i< myfocusperson.children.length;i++) {
                    myfocusperson.children[i].onclick=function(e) {
                        if(e.target.className=='user-focus') {
                            // 关注别人
                            if(e.target.innerHTML==='未关注') {
                                ajax({
                                    url:"http://175.178.193.182:8080/user/follow",
                                    type:"POST",
                                    async:true,
                                    data: {
                                        userId:myId,
                                        followerId:data.followsList[i].userId
                                    },
                                    success:function(data) {
                                        e.target.innerHTML='已关注';
                                    }
                                })
                            }else {
                                ajax({
                                    url:"http://175.178.193.182:8080/user/cancelFollow",
                                    type:"POST",
                                    async:true,
                                    data: {
                                        userId:myId,
                                        followerId:data.followsList[i].userId
                                    },
                                    success:function(data) {
                                        e.target.innerHTML='未关注';
                                    }
                                })
                            }
                        }
                    }
                }
            }
        })
    }
}

// 编辑资料页
const p_homepage=document.querySelector('.p-homepage')
const ptx=p_homepage.querySelector('.tx').querySelector('.img-box').querySelector('img');
const nickname=p_homepage.querySelector('.nickname');
const gender=p_homepage.querySelector('.gender');
const birthday=p_homepage.querySelector('.birthday');
const area=p_homepage.querySelector('.area');
const description=p_homepage.querySelector('.description');
const bg_img=p_homepage.querySelector('.bg-img').querySelector('img');
function goEdit(btn) {
    btn.onclick=function() {
        page.style.display='none';
        p_homepage.style.display='block'; 
    } 
    // 资料显示 渲染页面
    ajax ({
        url:"http://175.178.193.182:8080/user/baseInfo",
        type:"GET",
        async:true,
        data:{
            userId: myId
        },
        success:function(data) {
            console.log(data);
            ptx.src=data.user.avatar;
            nickname.value=data.user.nickname;
            gender.value=data.user.gender;
            area.value=data.user.area;
            birthday.value=data.user.birthday;
            description.value=data.user.description;
            bg_img.src=data.user.backGroundPicture;
        }
    })
    // 编辑资料
    // 头像和背景图文件
    const avatar=p_homepage.querySelector('.avatar');
    const backGroundPicture=p_homepage.querySelector('.backGroundPicture');
    const ph_mask=p_homepage.querySelector('.mask');
    const inform_sure=p_homepage.querySelector('.inform-sure');
    const php_back=document.querySelector('.php-back');
    // 点击跳出确定修改吗盒子 
    php_back.onclick=function() {
        ph_mask.style.display='block';
        inform_sure.style.display='block';
    }
    const sure_modify=p_homepage.querySelector('.sure-modify');
    const cancel_modify=p_homepage.querySelector('.cancel-modify');

    // 上传头像和背景图
    let avatar_file='';
    let bgimg_file='';
    avatar.onchange=function(e) {
        const imgURL=window.URL.createObjectURL(e.target.files[0]);
        ptx.src=imgURL;
        avatar_file=avatar.files[0];
    }
    backGroundPicture.onchange=function(e) {
        const imgURL=window.URL.createObjectURL(e.target.files[0]);
        bg_img.src=imgURL;
        bgimg_file=backGroundPicture.files[0];
    }
    // 上传函数 用formdata将数据一个一个添加 修改时再一起调用
    function upload(avatar_file,bgimg_file) {
        let xhr=new XMLHttpRequest();
        xhr.open('post','http://175.178.193.182:8080/user/upload',true);
        let formdata=new FormData();
        formdata.append('userId',myId);
        formdata.append('avatar',avatar_file);
        formdata.append('backGroundPicture',bgimg_file);
        // 请求文件是formdata格式
        xhr.send(formdata);
        xhr.onreadystatechange=function() {
            if(xhr.readyState===4&&xhr.status===200) {
                console.log(JSON.parse(xhr.responseText));
            }
        }
    }
    // 确定修改按钮点击
    sure_modify.onclick=function() {
        // 修改名字等样式
        ajax ({
            url:"http://175.178.193.182:8080/user/edit",
            type:"POST",
            async:true,
            data:{
                userId: myId,
                nickname:nickname.value,
                gender:gender.value,
                birthday:birthday.value,
                area:area.value,
                profession:'',
                description:description.value
            },
            success:function(data) {
                console.log(data);
            }
        })
        // 修改头像和背景图
        upload(avatar_file,bgimg_file);
        page.style.display='block';
        p_homepage.style.display='none';
        ph_mask.style.display='none';
        inform_sure.style.display='none';
    }
    // 取消按钮点击
    cancel_modify.onclick=function() {
        page.style.display='block';
        p_homepage.style.display='none';
        ph_mask.style.display='none';
        inform_sure.style.display='none';
    }
}