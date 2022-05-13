const search=document.querySelector('.search');
const sea_back=document.querySelector('.sea-back');
const go_search=document.querySelector('.go-search');
const search_btn=search.querySelector('.search-btn');
const search_input=search.querySelector('.input-search');
const search_box=search.getElementsByClassName('search-box')[0];
const search_article=search.querySelector('.search-article');
const search_user=search.querySelector('.search-user');
// 去搜索页面
go_search.onclick=function() {
    search.style.display='block';
    page.style.display='none';
}
// 退出搜索页面
sea_back.onclick=function() {
    page.style.display='block';
    search.style.display='none';
    search_box.innerHTML='';
    search_input.value='';
}
// 点击用户让用户的样式改变current
search_user.onclick=function() {
    search_user.className='current search-user';
    search_article.className='search-article';
}
// 点击文章让文章的样式改变current
search_article.onclick=function() {
    search_user.className='search-user';
    search_article.className='current search-article';
}
// 防抖 实时搜索实时显示搜索回应内容
document.onkeydown=debounce(searchSomething,1000);
function searchSomething() {
    // 搜索框内容不能是空格
    if(search_input.value.replace(/\s/g,'')) {
        // 搜索文章
        if(search_article.className=='current search-article') {
            // 清除上次搜索的文章
            search_box.innerHTML='';
             ajax ({
                url:"http://175.178.193.182:8080/search/byArticle",
                type:"GET",
                async:true,
                data:{
                    keyWord:search_input.value
                },
                success:function(data) {
                    console.log(data);
                    if(data.articles.length==0) {
                        search_box.innerHTML='没有更多了';
                    }else {
                        pageItem(data.articles,search_box);
                        pageBtn(search_box,data.articles);
                        search_box.className='search-box columns';
                    }
                }
            }) 
        }else {
            // 搜索用户
            search_box.innerHTML='';
            ajax ({
                url:"http://175.178.193.182:8080/search/byUser",
                type:"GET",
                async:true,
                data: {
                    keyWord:search_input.value
                },
                success:function(data) {
                    console.log(data);
                    if(data.users.length==0) {
                        search_box.innerHTML='没有更多了';
                    }else {
                        for(let i=0;i<data.users.length;i++) {
                            var div=user.cloneNode(true);
                            div.style.display='block';
                            div.id='';
                            search_box.appendChild(div)
                            var p=new User(div);
                            p.userShow(data.users[i]);
                        }
                        // 关注用户
                        for(let i=0;i<search_box.children.length;i++) {
                            ajax({
                                url:"http://175.178.193.182:8080/user/fanList",
                                type:"GET",
                                async:true,
                                data: {
                                    userId:data.users[i].userId
                                },
                                success:function(data) {
                                    console.log(data);
                                    for(let i=0;i<search_box.children.length;i++) {
                                        for(let j=0;j<data.fansList.length;j++) {
                                            if(data.fansList[j].userId==myId) {
                                                search_box.children[i].children[3].innerHTML='已关注';
                                                break;
                                            }else {
                                                search_box.children[i].children[3].innerHTML='未关注';
                                            }
                                        }
                                    }
                                }
                            })
                            // 搜索出来的用户的关注按钮功能
                            search_box.children[i].onclick=function(e) {
                                if(e.target.className=='user-focus') {
                                    // 关注别人
                                    if(e.target.innerHTML==='未关注') {
                                        ajax({
                                            url:"http://175.178.193.182:8080/user/follow",
                                            type:"POST",
                                            async:true,
                                            data: {
                                                userId:myId,
                                                followerId:data.users[i].userId
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
                                                followerId:data.users[i].userId
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
                }
            }) 
        }
        // 搜索用户按钮点击
        search_user.onclick=function() {
            search_user.className='current search-user';
            search_article.className='search-article';
            search_box.innerHTML='';
            if(search_input.value=='') {
                search_box.innerHTML='请输入搜索信息';
            }else {
                ajax ({
                    url:"http://175.178.193.182:8080/search/byUser",
                    type:"GET",
                    async:true,
                    data: {
                        keyWord:search_input.value
                    },
                    success:function(data) {
                        console.log(data);
                        if(data.users.length==0) {
                            search_box.innerHTML='没有更多了';
                        }else {
                            for(let i=0;i<data.users.length;i++) {
                                var div=user.cloneNode(true);
                                div.style.display='block';
                                div.id='';
                                search_box.appendChild(div)
                                var p=new User(div);
                                p.userShow(data.users[i]);
                                search_box.className='search-box';
                            }
                        }
                    }
                })
            }
        }
        // 搜索文章按钮点击
        search_article.onclick=function() {
            search_user.className='search-user';
            search_article.className='current search-article';
            search_box.innerHTML='';
            if(search_input.value=='') {
                search_box.innerHTML='请输入搜索信息';
            }else {
                ajax ({
                    url:"http://175.178.193.182:8080/search/byArticle",
                    type:"GET",
                    async:true,
                    data:{
                        keyWord:search_input.value
                    },
                    success:function(data) {
                        console.log(data);
                        if(data.articles.length==0) {
                            search_box.innerHTML='没有更多了';
                        }else {
                            pageItem(data.articles,search_box);
                            pageBtn(search_box,data.articles);
                            search_box.className='search-box columns';
                        }
                    }
                }) 
            }
        }
    }else {
        search_box.innerHTML='';
    }
} 
// 搜索按钮点击 也能达到搜索作用
search_btn.onclick=searchSomething()
