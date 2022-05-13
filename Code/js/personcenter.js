// 个人主页
const pc_tx=personcenter.querySelector('.headphoto').querySelector('img');
const pc_name=personcenter.querySelector('.nickname');
const pc_fans=personcenter.querySelector('.fans').children[1];
const pc_follows=personcenter.querySelector('.focus').children[1];
const pc_likes=personcenter.querySelector('.likes').children[1];
const pc_fansnum=personcenter.querySelector('.fans').children[0];
const pc_followsnum=personcenter.querySelector('.focus').children[0];
const pc_likesnum=personcenter.querySelector('.likes').children[0];
const postnote=personcenter.getElementsByClassName('postnote')[0];
const starnote=personcenter.getElementsByClassName('starnote')[0];
const likenote=personcenter.getElementsByClassName('likenote')[0];
const seepost=personcenter.getElementsByClassName('seepost')[0];
const seestar=personcenter.getElementsByClassName('seestar')[0];
const seelike=personcenter.getElementsByClassName('seelike')[0];

// 获取关注的人 粉丝 获赞
getFans(pc_fans,myId)
getLikes(pc_likes,myId)
getFollows(pc_follows,myId)


// 首页个人中心显示
ajax ({
    url:"http://175.178.193.182:8080/user/fullInfo",
    type:"GET",
    async:true,
    data:{
        userId: myId
    },
    success:function(data) {
        console.log(data);
        pc_tx.src=data.user.avatar;
        storage.setItem('avatar',JSON.stringify(data.user.avatar));
        storage.setItem('name',JSON.stringify(data.user.nickname));
        pc_name.innerHTML=data.user.nickname;
        pc_fansnum.innerHTML=data.user.fans.length;
        pc_followsnum.innerHTML=data.user.follows.length;
        pc_likesnum.innerHTML=data.user.staredArticles.length;
        // 获取发布笔记
        ajax({
            url:"http://175.178.193.182:8080/article/byAuthor",
            type:"GET",
            async:true,
            data: {
                authorId:data.user.userId
            },
            success:function(data) {
                console.log(data);
                starnote.innerHTML='';
                likenote.innerHTML='';
                postnote.innerHTML='';
                pageItem(data.articles,postnote);
                for(let i=0;i<postnote.children.length;i++) {
                    let nickname=postnote.children[i].getElementsByClassName('item-name')[0];
                    let avatar=postnote.children[i].getElementsByClassName('item-tx')[0].querySelector('img');
                    nickname.innerHTML=myName;
                    avatar.src=myAvatar;
                }
                pageBtn(postnote,data.articles);
            }
        })
        // 收藏的文章
        seestar.onclick=function() {
            seelike.className='';
            seepost.className='';
            this.className='current';
            postnote.innerHTML='';
            likenote.innerHTML='';
            postnote.style.display='none';
            starnote.style.display='block';
            likenote.style.display='none';
            ajax({
                url:"http://175.178.193.182:8080/article/getStar",
                type:"GET",
                async:true,
                data: {
                    userId:data.user.userId
                },
                success:function(data) {
                    console.log(data);
                    pageItem(data.staredArticles,starnote);
                    pageBtn(starnote,data.staredArticles);
                }
            }) 
        }
        // 喜欢过的文章
        seelike.onclick=function() {
            seestar.className='';
            seepost.className='';
            this.className='current';
            postnote.innerHTML='';
            starnote.innerHTML='';
            likenote.innerHTML='';
            postnote.style.display='none';
            starnote.style.display='none';
            likenote.style.display='block';
            ajax({
                url:"http://175.178.193.182:8080/article/getLike",
                type:"GET",
                async:true,
                data: {
                    userId:data.user.userId
                },
                success:function(data) {
                    console.log(data);
                    pageItem(data.likedArticles,likenote);
                    pageBtn(likenote,data.likedArticles);
                }
            })
            
        }
        // 发过的文章
        seepost.onclick=function() {
            seelike.className='';
            seestar.className='';
            this.className='current';
            starnote.innerHTML='';
            likenote.innerHTML='';
            postnote.innerHTML='';
            postnote.style.display='block';
            starnote.style.display='none';
            likenote.style.display='none';
            ajax({
                url:"http://175.178.193.182:8080/article/byAuthor",
                type:"GET",
                async:true,
                data: {
                    authorId:data.user.userId
                },
                success:function(data) {
                    console.log(data);
                    starnote.innerHTML='';
                    likenote.innerHTML='';
                    pageItem(data.articles,postnote);
                    pageBtn(likenote,data.articles);
                }
            })
        }
    }
})
// 将我的头像和名字存入数据库 后续用到
let myAvatar=JSON.parse( storage.getItem('avatar'));
let myName=JSON.parse(storage.getItem('name'));
// 编辑资料按钮
// 个人中心编辑资料
const go_php=document.querySelector('.go-php');
goEdit(go_php);


