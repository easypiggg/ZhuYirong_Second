// item模板
const item=document.getElementById('item');
// 定义一个类存放每个item模板
let that='';
class Item {
    constructor(div) {
        this.img_box=div.children[0];
        this.image=div.children[0].children[0];
        this.title=div.children[1];
        this.tximg=div.children[2].children[0].children[0];
        this.uname=div.children[2].children[1];
        this.num=div.children[2].children[2].children[1];
        this.delete=div.children[3];
    }
    itemShow(returndata) {
        this.tximg.src=returndata.avatar;
        this.uname.innerHTML=returndata.authorName;
        this.title.innerHTML=returndata.title;
        this.num.innerHTML=returndata.likerList.length;
        // this.image.src=returndata.images[0];
        // 懒加载
        this.image.setAttribute('data-src',returndata.images[0]);
    }
}

// 评论模板
const comment=document.querySelector('#comment');
class Comment {
    constructor(div) {
        that=this;
        box=div;
        this.likenum=div.children[4].children[1];
        this.like=div.children[4].children[0];
        this.delete=div.children[4].children[2];
        this.postDate=div.children[3];
        this.nickname=div.children[1];
        this.avatar=div.children[0].children[0];
        this.content=div.children[2];
        this.box=box;
    }
    commentShow(returndata) {
        this.postDate.innerHTML=returndata.postDate.slice(6,10);
        this.content.innerHTML=returndata.content;
        this.likenum.innerHTML=returndata.likes;
        // 点赞评论
        // 判断是否有点赞
        for(let i=0;i<returndata.likerList.length;i++) {
            if(returndata.likerList[i]==myId) {
                that.like.innerHTML='&#xe85c;'
                that.like.style.color='red';
            }
        }
        // 如果是自己的评论就有删除按钮
        if(returndata.authorId==myId) {
            that.delete.style.display='block';
            that.delete.onclick=function() {
                ajax({
                    url:"http://175.178.193.182:8080/review/delete",
                    type:"POST",
                    async:true,
                    data: {
                        reviewId:returndata.reviewId
                    },
                    success:function(data) {
                        console.log(data);
                    }
                })   
            }
        }
    }
}


// 文章详情页 只有一个 用的时候替换数据
const item_detail=document.querySelector('.item-detail');
const item_back=item_detail.querySelector('.item-back');

const author=document.querySelector('.author');
const author_tx=author.querySelector('.author-tx');
const author_tximg=author_tx.querySelector('img');
const author_name=author.querySelector('.author-name');
const author_focus=author.querySelector('.author-focus');

const article=document.querySelector('.article');
const article_img =article.querySelector('.article-img');
const article_imgol=article_img.querySelector('ol');
const article_imgul=article_img.querySelector('ul');
// const article_images =article_img.querySelector('img');
const article_title =article.querySelector('.article-title');
const article_content =article.querySelector('.article-content');
const article_like=document.querySelector('.article-likes').querySelector('.iconfont');
const article_likeBig=document.querySelector('.article-likes').querySelector('.scale');
const article_star=document.querySelector('.article-collect').querySelector('.iconfont');
const article_starBig=document.querySelector('.article-collect').querySelector('.scale');
const article_readcom=document.querySelector('.article-readcom').querySelector('.iconfont');
const likes_num=item_detail.querySelector('.likes-num');
const collect_num=item_detail.querySelector('.collect-num');
const com_num=item_detail.querySelector('.com-num');
const article_tags=article.querySelector('.article-tags');
const article_time=article.querySelector('.article-time').querySelector('.fl');

const comment_box=document.querySelector('.comment-box');
const comments_tximg=document.querySelector('.comments-tx').querySelector('img');
const comments_num=document.querySelector('.comments-num').querySelector('span');
const article_comment=document.querySelectorAll('.article-comment');

const reply_container=document.querySelector('.reply-container');
const article_delete=document.querySelector('.article-delete');
const body=document.querySelector('body');
function articleShow(returndata) {
    article_time.innerHTML=returndata.postDate.slice(6,10);
    likes_num.innerHTML=returndata.likes;
    comments_tximg.src=returndata.avatar;
    author_tximg.src=returndata.avatar;
    author_name.innerHTML=returndata.authorName;
    collect_num.innerHTML=returndata.stars;
    comments_num.innerHTML=returndata.reviews;
    com_num.innerHTML=returndata.reviews;
    article_title.innerHTML=returndata.title;
    article_content.innerHTML=returndata.content;
    // article_images.src=returndata.images[0];
    // 如果是自己的文章则有删除按钮
    if(returndata.authorId==52) {
        comments_tximg.src=myAvatar;
        author_name.innerHTML=myName;
        article_delete.style.display='block';
        article_delete.onclick=function() {
             ajax ({
                url:"http://175.178.193.182:8080/article/delete",
                type:"POST",
                async:true,
                data:{
                    articleId:returndata.articleId
                },
                success:function(data) {
                    console.log(data);
                },
            }) 
        }
    }
    // 根据作者id判断是否有关注
    ajax({
        url:"http://175.178.193.182:8080/user/fanList",
        type:"GET",
        async:true,
        data: {
            userId:returndata.authorId
        },
        success:function(data) {
            console.log(data);
            for(let i=0;i<data.fansList.length;i++) {
                if(data.fansList[i].userId==myId) {
                    author_focus.innerHTML='已关注';
                    break;
                }else {
                    author_focus.innerHTML='未关注';
                }
            }
        }
    })
    // 关注别人
    author_focus.onclick=function() {
        if(author_focus.innerHTML==='未关注') {
            ajax({
                url:"http://175.178.193.182:8080/user/follow",
                type:"POST",
                async:true,
                data: {
                    userId:myId,
                    followerId:returndata.authorId
                },
                success:function(data) {
                    console.log(data);
                    author_focus.innerHTML='已关注';
                }
            })
        }else {
            ajax({
                url:"http://175.178.193.182:8080/user/cancelFollow",
                type:"POST",
                async:true,
                data: {
                    userId:myId,
                    followerId:returndata.authorId
                },
                success:function(data) {
                    console.log(data);
                    author_focus.innerHTML='未关注';
                }
            })
        }
    }
    // 点赞文章
    // 判断是否有点赞
    for(let i=0;i<returndata.likerList.length;i++) {
        if(returndata.likerList[i]==myId) {
            article_like.innerHTML='&#xe85c;'
            article_like.style.color='red';
            article_like.className='iconfont';
        }
    }
    article_like.onclick=function() {
        if(article_like.innerHTML==='') {
            ajax({
                url:"http://175.178.193.182:8080/article/like",
                type:"POST",
                async:true,
                data: {
                    userId:myId,
                    articleId:returndata.articleId
                },
                success:function(data) {
                    console.log(data);
                    article_like.innerHTML='&#xe85c;';
                    article_like.style.color='red';
                    article_likeBig.style.display='block';
                    setTimeout(function() {
                        article_likeBig.style.display='none';
                    },2000);
                }
            })
        }else {
            ajax({
                url:"http://175.178.193.182:8080/article/unlike",
                type:"POST",
                async:true,
                data: {
                    userId:myId,
                    articleId:returndata.articleId
                },
                success:function(data) {
                    console.log(data);
                    article_like.innerHTML='&#xe670;';
                    article_like.style.color='#000';
                }
            })
        }
    }
    // 收藏文章
    // 判断是否有收藏
    for(let i=0;i<returndata.starerList.length;i++) {
        if(returndata.starerList[i]==myId) {
            article_star.innerHTML='&#xe610;'
            article_star.style.color='rgb(255, 206, 71)';
        }
    }
    article_star.onclick=function() {
        if(article_star.innerHTML==='') {
            ajax({
                url:"http://175.178.193.182:8080/article/star",
                type:"POST",
                async:true,
                data: {
                    userId:myId,
                    articleId:returndata.articleId
                },
                success:function(data) {
                    console.log(data);
                    article_star.innerHTML='&#xe610;';
                    article_star.style.color='rgb(255, 206, 71)';
                    article_starBig.style.display='block';
                    setTimeout(function() {
                        article_starBig.style.display='none';
                    },2000);
                }
            })
        }else {
            ajax({
                url:"http://175.178.193.182:8080/article/unstar",
                type:"POST",
                async:true,
                data: {
                    userId:myId,
                    articleId:returndata.articleId
                },
                success:function(data) {
                    console.log(data);
                    article_star.innerHTML='&#xe66f;';
                    article_star.style.color='#000'; 
                }
            })
        }
    }
    // 点击评论图标跳转到评论位置
    article_readcom.onclick=function() {
        location.href='#comment-box';
    }  
    // 循环添加图片
    for(let i=0;i<returndata.images.length;i++) {
        var li=document.createElement('li');
        article_imgul.appendChild(li);
        var img=document.createElement('img');
        img.src=returndata.images[i];
        li.appendChild(img);
    }
    // 轮播图
    //轮播图函数
    const ullis=article_imgul.getElementsByTagName('li');
    // 根据图片个数添加ol小li个数
    for(let i=0;i<ullis.length;i++) {
        var li=document.createElement('li');
        article_imgol.appendChild(li);
    }
    const ollis=article_imgol.getElementsByTagName('li');
    // 底部的小li点击跳转对应图片
    for(let i=0;i<ollis.length;i++) {
        ollis[i].onclick=function() {
            for(let j=0;j<ullis.length;j++) {
                ullis[j].style.display='none';
                ollis[j].style.backgroundColor='#fff';
            }
            ullis[i].style.display='block';
            ollis[i].style.backgroundColor='rgb(155, 106, 208)';
        }
    }
    function InitMove(index) {
        for(let i=0;i<ullis.length;i++) {
            ullis[i].style.display='none';
            ollis[i].style.backgroundColor='#fff';
        }
        ullis[index].style.display='block';
        ollis[index].style.backgroundColor='rgb(155, 106, 208)';
    }
    // 初始化
    InitMove(0);
    let count=1;
    function fMove() {
        if(count===ullis.length) {
            count=0;
        }
        InitMove(count);
        count++;
    }
    // 轮播图开始
    var scrollMove=setInterval(fMove,3500)
    article_imgul.onmouseover=function() {
        clearInterval(scrollMove);
    }
    article_imgul.onmouseleave=function() {
        scrollMove=setInterval(fMove,3000)
    }

    // 循环添加标签
    for(let i=0;i<returndata.tags.length;i++) {
        var span=document.createElement('span');
        span.innerHTML=returndata.tags[i];
        article_tags.appendChild(span);
    } 

    // 获取评论
    ajax ({
        url:"http://175.178.193.182:8080/review/byArticle",
        type:"GET",
        async:true,
        data:{
            articleId:returndata.articleId,
            pages:''
        },
        success:function(data) {
            console.log(data);
            for(let i=0;i<data.reviews.length;i++) {
                // 添加评论
                var div=comment.cloneNode(true);
                div.id='';
                div.style.display='block';
                comment_box.appendChild(div);
                let p=new Comment(div);
                p.commentShow(data.reviews[i]);
                let nickname=p.nickname.innerHTML;
                // 获取评论用户信息 头像 昵称
                ajax({
                    url:"http://175.178.193.182:8080/user/baseInfo",
                    type:"GET",
                    async:true,
                    data: {
                        userId:data.reviews[i].authorId
                    },
                    success:function(data) {
                        p.nickname.innerHTML=data.user.nickname;
                        p.avatar.src=data.user.avatar;
                    }
                })
                // 点赞评论
                p.like.onclick=function() {
                    if(p.like.innerHTML==='') {
                        ajax({
                            url:"http://175.178.193.182:8080/review/like",
                            type:"POST",
                            async:true,
                            data: {
                                userId:myId,
                                reviewId:data.reviews[i].reviewId
                            },
                            success:function(data) {
                                console.log(data);
                                p.like.innerHTML='&#xe85c;';
                                p.like.style.color='red';
                            }
                        })
                    }else {
                        ajax({
                            url:"http://175.178.193.182:8080/review/unlike",
                            type:"POST",
                            async:true,
                            data: {
                                userId:myId,
                                reviewId:data.reviews[i].reviewId
                            },
                            success:function(data) {
                                console.log(data);
                                p.like.innerHTML='&#xe670;';
                                p.like.style.color='#000';
                            }
                        })
                    }
                }
                // 点击评论头像跳转主页
                p.avatar.onclick=function() {
                    search.style.display='none';
                    mlikes_page.style.display='none';
                    mfocus_page.style.display='none';
                    focus_page.style.display='none';
                    item_detail.style.display='none';
                    var divp=userhp.cloneNode(true);
                    divp.id='';
                    divp.style.display='block';
                    var p=new Userhp(divp);
                    p.userhpShow(data.reviews[i].authorId);
                    p.sendMessage(data.reviews[i],data.reviews[i].authorId);
                    p.back.onclick=function() {
                        divp.style.display='none';
                        item_detail.style.display='block';
                    }
                    body.appendChild(divp);
                }
            }
        }
    })
                
     // 点击评论功能
     for(let i=0;i<article_comment.length;i++) {
         article_comment[i].onfocus=function() {
            document.onkeydown=function(e) {
                if(e.keyCode==13) {
                    ajax({
                        url:"http://175.178.193.182:8080/review",
                        type:"POST",
                        async:true,
                        data: {
                            replyToUserId:returndata.authorId,
                            replyToArticleId:returndata.articleId,
                            parentReviewId:'',
                            authorId:myId,
                            content:article_comment[i].value
                        },
                        success:function(data) {
                            console.log(data);
                        }
                    })
                }
            }
        }
     }

    // 点击作者头像去主页
     author_tximg.onclick=function() {
        search.style.display='none';
        mlikes_page.style.display='none';
        mfocus_page.style.display='none';
        focus_page.style.display='none';
        item_detail.style.display='none';
        var divp=userhp.cloneNode(true);
        divp.id='';
        divp.style.display='block';
        var p=new Userhp(divp);
        p.userhpShow(returndata.authorId);
        p.sendMessage(returndata,returndata.authorId);
        p.back.onclick=function() {
            divp.style.display='none';
            item_detail.style.display='block';
        }
        body.appendChild(divp);
    } 
    item_back.onclick=function() {
        // 清除里面图片和标签
        article_imgul.innerHTML='';
        article_imgol.innerHTML='';
        article_tags.innerHTML='';
        comment_box.innerHTML='';
        // 清除定时器
        clearInterval(scrollMove)
        item_detail.style.display='none';
        page.style.display='block';
    }
   
}  

// 喜欢的笔记模板
const likenote_format=document.getElementById('likenote-format');
class Likenote {
    constructor(div) {
        that=this;
        this.avatar=div.children[0].children[0];
        this.nickname=div.children[1];
        this.description=div.children[2];
        this.likenote=div.children[3].children[0];
    }
    likenoteShow(returndata) {
        this.avatar.src=returndata.userInfo.avatar;
        this.nickname.innerHTML=returndata.userInfo.nickname;
        this.description.innerHTML=returndata.userInfo.description;
        this.likenote.src=returndata.articleInfo.images[0];
        // 点击去往个人主页
        this.avatar.onclick=function() {
            search.style.display='none';
            mlikes_page.style.display='none';
            mfocus_page.style.display='none';
            focus_page.style.display='none';
            var divp=userhp.cloneNode(true);
            divp.id='';
            divp.style.display='block';
            var p=new Userhp(divp);
            p.userhpShow(returndata.userInfo.userId);
            p.sendMessage(returndata.userInfo,returndata.userInfo.userId);
            p.back.onclick=function() {
                divp.style.display='none';
                page.style.display='block';
            }
            body.appendChild(divp);
        }
    }
}

// 用户模板
const user=document.querySelector('#user');
class User {
    constructor(div) {
        that=this;
        this.avatar=div.children[0].children[0];
        this.nickname=div.children[1];
        this.description=div.children[2];
        this.focus_state=div.children[3];
    }
    userShow(returndata) {
        this.avatar.src=returndata.avatar;
        this.nickname.innerHTML=returndata.nickname;
        this.description.innerHTML=returndata.description;
        if(returndata.userId==myId) {
            that.focus_state.style.display='none';
        }else {
            // 根据作者id判断是否有关注
            ajax({
                url:"http://175.178.193.182:8080/user/fanList",
                type:"GET",
                async:true,
                data: {
                    userId:returndata.userId
                },
                success:function(data) {
                    for(let i=0;i<data.fansList.length;i++) {
                        if(data.fansList[i].userId==myId) {
                            that.focus_state.innerHTML='已关注';
                            break;
                        }else {
                            that.focus_state.innerHTML='未关注';
                        }
                    }
                }
            })
        }
        // 点击去往个人主页
        this.avatar.onclick=function() {
            search.style.display='none';
            mlikes_page.style.display='none';
            mfocus_page.style.display='none';
            focus_page.style.display='none';
            var divp=userhp.cloneNode(true);
            divp.id='';
            divp.style.display='block';
            var p=new Userhp(divp);
            p.userhpShow(returndata.userId);
            p.sendMessage(returndata,returndata.userId);
            p.back.onclick=function() {
                divp.style.display='none';
                page.style.display='block';
            }
            body.appendChild(divp);
        }
    }
}
// 个人主页
const userhp=document.getElementById('userhp');
let box='';
class Userhp {
    constructor(div) {
        that=this;
        box=div;
        this.back=div.children[0].children[0];
        this.olnav=div.children[5];
        this.postbtn=div.children[5].children[0];
        this.starbtn=div.children[5].children[1];
        this.likebtn=div.children[5].children[2];
        this.avatar=div.children[1].children[0];
        this.nickname=div.children[2];
        this.followsnum=div.children[3].children[0].children[0];
        this.fansnum=div.children[3].children[1].children[0];
        this.likesnum=div.children[3].children[2].children[0];
        this.nickname=div.children[2];
        this.follows=div.children[3].children[0].children[1];
        this.fans=div.children[3].children[1].children[1];
        this.likes=div.children[3].children[2].children[1];
        this.send_message=div.children[4];
        this.post_note=div.children[6];
        this.star_note=div.children[7];
        this.like_note=div.children[8];
    }
    // 发送信息按钮
    sendMessage(returndata,receiverId) {
        // 我的主页就是编辑资料 有编辑资料功能
        if(returndata.userId==myId) {
            returndatathat.send_message.innerHTML='编辑资料';
            goEdit(that.send_message)
        }else {
            that.send_message.onclick=function() {
                box.style.display='none';
                var div1=chatpage.cloneNode(true);
                div1.id='';
                div1.style.display='block';
                var p=new Chatpage(div1);
                p.chatpageShow(returndata,receiverId);
                body.appendChild(div1);
            }
        }
    }
    // 个人主页展示
    userhpShow(returndata) {
        // 关注的人
        getFollows(that.follows,returndata);
        focus_back.onclick=function() {
            box.style.display='block';
            focus_page.style.display='none';
        }
        // 粉丝
        getFans(that.fans,returndata);
        mfocus_back.onclick=function() {
            box.style.display='block';
            mfocus_page.style.display='none';
        }
        // 获赞
        getLikes(that.likes,returndata);

        mlikes_back.onclick=function() {
            box.style.display='block';
            mlikes_page.style.display='none';
            likeperson_btn.className='current likeperson-btn';
            starperson_btn.className='starperson-btn';
        }
        // 填充完整信息
        ajax ({
            url:"http://175.178.193.182:8080/user/fullInfo",
            type:"GET",
            async:true,
            data:{
                userId: returndata
            },
            success:function(data) {
                console.log(data);
                that.avatar.src=data.user.avatar;
                that.nickname.innerHTML=data.user.nickname;
                that.fansnum.innerHTML=data.user.fans.length;
                that.followsnum.innerHTML=data.user.follows.length;
                that.likesnum.innerHTML=data.user.staredArticles.length;
                // 发过的文章
                ajax({
                    url:"http://175.178.193.182:8080/article/byAuthor",
                    type:"GET",
                    async:true,
                    data: {
                        authorId:data.user.userId
                    },
                    success:function(data) {
                        console.log(data);
                        that.star_note.innerHTML='';
                        that.post_note.innerHTML='';
                        that.like_note.innerHTML='';
                        pageItem(data.articles,that.post_note);                        
                        pageBtn(that.post_note,data.articles); 
                    }
                })
                // 收藏的文章
                that.starbtn.onclick=function() {
                    for(let i=0;i<that.olnav.children.length;i++) {
                        that.olnav.children[i].className='';
                    }
                    this.className='current';
                     ajax({
                        url:"http://175.178.193.182:8080/article/getStar",
                        type:"GET",
                        async:true,
                        data: {
                            userId:data.user.userId
                        },
                        success:function(data) {
                            console.log(data);
                            that.star_note.innerHTML='';
                            that.post_note.innerHTML='';
                            that.like_note.innerHTML='';
                            pageItem(data.staredArticles,that.star_note); 
                            pageBtn(that.star_note,data.staredArticles); 
                        }
                    })  
                }
                // 喜欢的文章
                that.likebtn.onclick=function() {
                    for(let i=0;i<that.olnav.children.length;i++) {
                        that.olnav.children[i].className='';
                    }
                    this.className='current';
                     ajax({
                        url:"http://175.178.193.182:8080/article/getLike",
                        type:"GET",
                        async:true,
                        data: {
                            userId:data.user.userId
                        },
                        success:function(data) {
                            console.log(data);
                            that.star_note.innerHTML='';
                            that.post_note.innerHTML='';
                            that.like_note.innerHTML='';
                            pageItem(data.likedArticles,that.like_note);                        
                            pageBtn(that.like_note,data.likedArticles); 
                        }
                    })  
                }
                // 发过的文章
                that.postbtn.onclick=function() {
                    for(let i=0;i<that.olnav.children.length;i++) {
                        that.olnav.children[i].className='';
                    }
                    this.className='current'; 
                    ajax({
                        url:"http://175.178.193.182:8080/article/byAuthor",
                        type:"GET",
                        async:true,
                        data: {
                            authorId:data.user.userId
                        },
                        success:function(data) {
                            console.log(data);
                            that.star_note.innerHTML='';
                            that.post_note.innerHTML='';
                            that.like_note.innerHTML='';
                            pageItem(data.articles,that.post_note);                        
                            pageBtn(that.post_note,data.articles); 
                        }
                    }) 
                }
            }
        })
    }
}