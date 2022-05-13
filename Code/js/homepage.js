const homepage=document.getElementById('homepage')
const h_page=document.querySelector('.h-page');
// 底部我的消息
const mymessage=document.getElementById('mymessage');
const m_message=document.querySelector('.m-message');
// 底部个人中心
const personcenter=document.getElementById('personcenter');
const p_center=document.querySelector('.p-center');
// 底部点击按钮
function footerBtn(btn,btnpage) {
    btn.onclick=function() {
        page.style.display='block';
        homepage.style.display='none';
        mymessage.style.display='none';
        personcenter.style.display='none';
        btnpage.style.display='block';
        h_page.className='';
        m_message.className='';
        p_center.className='';
        btn.className='current';
    }
} 
footerBtn(h_page,homepage);//底部首页按钮点击
footerBtn(m_message,mymessage);//底部我的消息点击
footerBtn(p_center,personcenter);//底部个人中心点击


const recom=document.getElementsByClassName('recom')[0];
const travel=document.getElementsByClassName('travel')[0];
const food=document.getElementsByClassName('food')[0];
const fashion=document.getElementsByClassName('fashion')[0];
const makeup=document.getElementsByClassName('makeup')[0];
const efficient=document.getElementsByClassName('efficient')[0];
const skincare=document.getElementsByClassName('skincare')[0];
 ajax ({
    url:"http://175.178.193.182:8080/article/getHomePage",
    type:"GET",
    async:true,
    data:{},
    success:function(data) {
        console.log(data);
        // 渲染item页面 
        pageItem(data.pages.推荐,recom);
        pageBtn(recom,data.pages.推荐);
        // 导航栏点击
        const content=document.getElementsByClassName('content')[0];
        const contentBoxs=content.getElementsByClassName('content-box');
        const hp_nav=document.querySelector('.homepage').querySelector('.nav');
        const hp_navlis=hp_nav.querySelectorAll('.navli');
        for(let i=0;i<hp_navlis.length;i++) {
            hp_navlis[i].setAttribute('index',i);
            hp_navlis[i].children[0].onclick=function() {
                for(let j=0;j<hp_navlis.length;j++) {
                    hp_navlis[j].children[0].className='';
                    contentBoxs[j].style.display='none';
                }
                this.className='current';
                contentBoxs[i].style.display='block';
                // 点击对应页面 对应页面显示
                switch(i) {
                    case 0:
                        recom.innerHTML='';
                        pageItem(data.pages.推荐,recom);
                        pageBtn(recom,data.pages.推荐);
                        break;
                    case 1:
                        travel.innerHTML='';
                        pageItem(data.pages.旅行,travel);
                        pageBtn(travel,data.pages.旅行);
                        break;
                    case 2:
                        food.innerHTML='';
                        pageItem(data.pages.美食,food);
                        pageBtn(food,data.pages.美食);
                        break;
                    case 3:
                        fashion.innerHTML='';
                        pageItem(data.pages.时尚,fashion);
                        pageBtn(fashion,data.pages.时尚);
                        break;
                    case 4:
                        makeup.innerHTML='';
                        pageItem(data.pages.彩妆,makeup);
                        pageBtn(makeup,data.pages.彩妆);
                        break;
                    case 5:
                        efficient.innerHTML='';
                        pageItem(data.pages.高效,efficient);
                        pageBtn(efficient,data.pages.高效);
                        break;
                    case 6:
                        skincare.innerHTML='';
                        pageItem(data.pages.护肤,skincare);
                        pageBtn(skincare,data.pages.护肤);
                        break
                }
            }
        }
        // 事件委托 给每个页面一个点击效果
        // pageBtn(recom,data.pages.推荐);
        // pageBtn(travel,data.pages.旅行);
        // pageBtn(food,data.pages.美食);
        // pageBtn(fashion,data.pages.时尚);
        // pageBtn(makeup,data.pages.彩妆);
        // pageBtn(efficient,data.pages.高效);
        // pageBtn(skincare,data.pages.护肤);
    }
})



// item的排版 瀑布流
// item布局
// function itemSort(box) {
//     const heightArray=[];
//     var items= box.getElementsByClassName('item');
//     console.log(items);
//     for(let i=0;i<items.length;i++) {
//         console.log(items[i].offsetHeight);
//         if(i<2) {
//             items[i].style.left=220*i+'px';
//             heightArray[i]=items[i].offsetHeight;
//         }
//         else {
//             let minHeight=Math.min.apply(Math,heightArray);
//             let minIndex=heightArray.indexOf(minHeight);
//             items[i].style.top=minHeight+5+'px';
//             items[i].style.left=minIndex*220+'px';
//             heightArray[minIndex]+=items[i].offsetHeight;
//         }
//     }
// }
// itemSort(recom);
// itemSort(travel);
// itemSort(food);
// itemSort(fashion);
// itemSort(makeup);
// itemSort(efficient);
// itemSort(skincare);