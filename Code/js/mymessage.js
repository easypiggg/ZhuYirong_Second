// 我的消息页面
const m_back=document.querySelector('.message-back');
m_back.onclick=function() {
    mymessage.style.display='none';
    homepage.style.display='block';
}
// 赞与收藏页面
const m_likes=document.querySelector('.m-likes');
getLikes(m_likes,myId);
// 新增关注页面
const m_focus=document.querySelector('.m-focus');
getFans(m_focus,myId);
// 评论和@
const m_comments=document.querySelector('.m-comments');
const mcomments_page=document.querySelector('.mcomments-page');
const mcomments_back=document.querySelector('.mcomments-back');
const commentperson=document.querySelector('.commentperson');
mcomments_back.onclick=function() {
    page.style.display='block';
    mcomments_page.style.display='none';
}
m_comments.onclick=function() {
    page.style.display='none';
    mcomments_page.style.display='block';
    commentperson.innerHTML='';
    commentperson.innerHTML='';
    ajax({
        url:"http://175.178.193.182:8080/notice/comment",
        type:"GET",
        async:true,
        data: {
            userId:myId
        },
        success:function(data) {
            console.log(data);
            for(let i=0;i<data.like.length;i++) {
                var div=likenote_format.cloneNode(true);
                div.id='';
                div.style.display='block';
                var p=new Likenote(div);
                p.likenoteShow(data.like[i]);
                commentperson.appendChild(div);
                p.description.innerHTML='评论了你的笔记';
            }
        }
    })
}

// 聊天小框模板
const chatbox=document.getElementById('chatbox');
class Chatbox {
    constructor(div) {
        that=this;
        box=div;
        this.avatar=div.children[0].children[0];
        this.nickname=div.children[1];
        this.description=div.children[2];
    }
    chatboxShow(returndata) {
        this.avatar.src=returndata.avatar;
        this.nickname.innerHTML=returndata.nickname;
        this.description.innerHTML=returndata.description;
        // 点击跳转聊天界面
        box.onclick=function() {
            ajax ({
                url:"http://175.178.193.182:8080/chat/getRecord",
                type:"GET",
                async:true,
                data:{
                    userId:myId,
                    receiverId:returndata.userId,
                    page:1
                },
                success:function(data) {
                    console.log(data);
                },
            }) 
        }
    }

}

// 获取聊天列表
ajax({
    url:"http://175.178.193.182:8080/chat/getList",
    type:"GET",
    async:true,
    data: {
        userId:myId
    },
    success:function(data) {
        console.log(data);
        for(let i=0;i<data.chatList.length;i++) {
            var div=chatbox.cloneNode(true);
            div.id='';
            div.style.display='block';
            var p=new Chatbox(div);
            p.chatboxShow(data.chatList[i]);
            chat_container.appendChild(div);
            div.onclick=function() {
                page.style.display='none';
                var div1=chatpage.cloneNode(true);
                div1.id='';
                div1.style.display='block';
                var p=new Chatpage(div1);
                p.chatpageShow(data.chatList[i],data.chatList[i].userId);
                body.appendChild(div1);
            }
        }
    }
})

// 聊天页面模板
const chatpage=document.getElementById('chatpage');
class Chatpage {
    constructor(div) {
        box=div;
        that=this;
        this.chatback=div.children[0].children[0];
        this.nickname=div.children[0].children[1];
        this.dialog_container=div.children[1];
        this.postcontent=div.children[2].children[0].children[0];
        this.postbtn=div.children[2].children[0].children[1];    
    }
    chatpageShow(returndata,receiverId) {
        this.nickname.innerHTML=returndata.nickname;
        this.chatback.onclick=function() {
            page.style.display='block';
            box.style.display='none';
        }
        // 获取聊天记录 渲染到页面中
         ajax ({
            url:"http://175.178.193.182:8080/chat/getRecord",
            type:"GET",
            async:true,
            data:{
                userId:myId,
                receiverId:receiverId,
                page:1
            },
            success:function(data) {
                console.log(data);
                for(let i=0;i<data.newRecord.length;i++) {
                    if(data.newRecord[i].userId==myId) {
                        var div=m_dialogbox.cloneNode(true);
                        div.id='';
                        div.style.display='block';
                        var p=new Mdialog(div);
                        p.mdialogShow(data.newRecord[i]);
                        that.dialog_container.appendChild(div);
                    }else {
                        var div=u_dialogbox.cloneNode(true);
                        div.id='';
                        div.style.display='block';
                        var p=new Udialog(div);
                        p.udialogShow(data.newRecord[i]);
                        p.avatar.src =returndata.avatar;
                        that.dialog_container.appendChild(div);
                    }
                }
            }
        }) 
        // 发送信息 防抖
        this.postbtn.onclick=debounce(sendmessage,2000) 
        function sendmessage() {
            ajax ({
                url:"http://175.178.193.182:8080/chat/send",
                type:"POST",
                async:true,
                data:{
                    userId:myId,
                    receiverId:receiverId,
                    message:that.postcontent.value
                },
                success:function(data) {
                    console.log(data);
                    // 点击的时候获取实时聊天记录
                    ajax ({
                        url:"http://175.178.193.182:8080/chat/getRecord",
                        type:"GET",
                        async:true,
                        data:{
                            userId:myId,
                            receiverId:receiverId,
                            page:1
                        },
                        success:function(data) {
                            console.log(data);
                            that.dialog_container.innerHTML='';
                            for(let i=0;i<data.newRecord.length;i++) {
                                // 我的对话框
                                if(data.newRecord[i].userId==myId) {
                                    var div=m_dialogbox.cloneNode(true);
                                    div.id='';
                                    div.style.display='block';
                                    var p=new Mdialog(div);
                                    p.mdialogShow(data.newRecord[i]);
                                    that.dialog_container.appendChild(div);
                                }else {
                                    // 对方的对话框
                                    var div=u_dialogbox.cloneNode(true);
                                    div.id='';
                                    div.style.display='block';
                                    var p=new Udialog(div);
                                    p.udialogShow(data.newRecord[i]);
                                    p.avatar.src =returndata.avatar;
                                    that.dialog_container.appendChild(div);
                                }
                            }
                        }
                    })
                }
            }) 
        }
    }
}
const dialog_container=document.getElementById('dialog-container');
const m_dialogbox=document.getElementById('m-dialogbox');
var thatt='';
// 我的对话框模板
class Mdialog {
    constructor(div) {
        thatt=this;
        this.avatar=div.children[0].children[0];
        this.content=div.children[1].children[0];
    }
    mdialogShow(returndata) {
        this.content.innerHTML=returndata.message;
        this.avatar.src=myAvatar;
    }
}
// 对方的对话框模板
const u_dialogbox=document.getElementById('u-dialogbox');
class Udialog {
    constructor(div) {
        this.avatar=div.children[0].children[0];
        this.content=div.children[1].children[0];
    }
    udialogShow(returndata) {
        this.content.innerHTML=returndata.message;

    }
}

// 放消息列表的盒子
const chat_container=document.querySelector('.chatcontainer');
// 放一个机器人聊天
var div=chatbox.cloneNode(true);
div.id='';
div.style.display='block';
var p=new Chatbox(div);
chat_container.appendChild(div);
div.onclick=function() {
    page.style.display='none';
    var div1=chatpage.cloneNode(true);
    div1.id='';
    div1.style.display='block';
    var p1=new Chatpage(div1);
    p1.nickname.innerHTML='Robot';
    p1.chatback.onclick=function() {
        page.style.display='block';
        div1.style.display='none';
    } 
    p1.postbtn.onclick=function() {
        if(p1.postcontent.value=='') {
            alert('请输入内容');
        }else {
            var div2=m_dialogbox.cloneNode(true);
            div2.id='';
            div2.style.display='block';
            var p2=new Mdialog(div2);
            p2.content.innerHTML=p1.postcontent.value;
            p2.avatar.src=myAvatar;
            p1.dialog_container.appendChild(div2);
            ajax ({
                url:"https://api.ownthink.com/bot",
                type:"POST",
                async:true,
                data:{
                    spoken:p1.postcontent.value,
                    appid:'d8d7afce0e22c572a333746d2af834ce',
                    userid:myId
                },
                success:function(data) {
                    var div3=u_dialogbox.cloneNode(true);
                    div3.id='';
                    div3.style.display='block';
                    var p3=new Udialog(div3);
                    p3.content.innerHTML=data.data.info.text;
                    p3.avatar.src=p.avatar.src;
                    p1.dialog_container.appendChild(div3);
                    p1.postcontent.value='';
                }
            })
        }
    }
    body.appendChild(div1);
}





