const write=document.querySelector('.write');
const wri_back=document.querySelector('.wri-back');
const go_write=document.querySelector('.go-write');
const write_form=document.getElementById('write-form');
const write_title=write_form.querySelector('.title');
const write_content=write_form.querySelector('.content');
const write_tags=write_form.querySelector('.tags');
const topic=write_form.querySelector('.topic');
const tags_box=document.querySelector('.tags-box');
const mask=document.querySelector('.mask');
const tags_content=document.querySelector('.tags-content');
const tags_sure=document.querySelector('.tags-sure');
const tags_cancel=document.querySelector('.tags-cancel');
const tagsArr=[];
// 去发文章页面
go_write.onclick=function() {
    write.style.display='block';
    page.style.display='none';
}
// 退出发文章页面
wri_back.onclick=function() {
    write.style.display='none';
    page.style.display='block';
}
// 标签点击 跳出盒子输入标签内容
topic.onclick=function() {
    tags_box.style.display='block';
    mask.style.display='block';
}
// 点击确定后将标签渲染在页面上
tags_sure.onclick=function() {
    tags_box.style.display='none';
    mask.style.display='none';
    tagsArr.push(tags_content.value)
    write_tags.value=tagsArr;
    tags_content.value='';
}
tags_cancel.onclick=function() {
    tags_box.style.display='none';
    mask.style.display='none';
}
const write_files=write_form.querySelector('.file');
const img_container=write_form.querySelector('.img-container');
const img_showbox=write_form.querySelector('.img-box');
const img_show=img_showbox.querySelector('img');
let file='';
let imgURL='';
// 点击上传头像 获取返回图片url
write_files.onchange=function() {
    const imgurl=window.URL.createObjectURL(write_files.files[0]);
    img_container.style.display='block';
    img_show.src=imgurl;
    console.log(imgurl);
    uploadimg(write_files.files[0]);  
}
function uploadimg(file) {
    let xhr=new XMLHttpRequest();
    xhr.open('post','http://175.178.193.182:8080/upload/image',true);
    let formdata=new FormData();
    formdata.append('image',file);
    xhr.send(formdata);
    xhr.onreadystatechange=function() {
        if(xhr.readyState===4&&xhr.status===200) {
            imgURL=JSON.parse(xhr.responseText).url;
        }
    }
}
// 发布按钮点击 发布文章
const post_btn=document.querySelector('.post-btn');
post_btn.onclick=function() {
        if(imgURL=='') {
            alert('请至少上传一张图片');
        }else {
            ajax ({
                url:"http://175.178.193.182:8080/article",
                type:"POST",
                async:true,
                data:{
                    userId: myId,
                    title: write_title.value,
                    content:write_content.value,
                    tags:tagsArr,
                    images:imgURL
                },
                success:function(data) {
                    console.log(data);
                    // 发送成功后跳转主页 并将页面内容清空
                    write.style.display='none';
                    page.style.display='block';
                    img_container.style.display='none';
                    write_title.value='';
                    write_content.value='';
                    tagsArr.length=0;
                    write_tags.value=''
                }
                }) 
        }
} 


