function debounce(func,wait) {
    var wait=wait||1000;
    var timer;
    return function() {
        var _this=this;
        var args=arguments;
        clearTimeout(timer);
        timer=setTimeout(()=>func.apply(_this,args),wait);
    }
}

function throttle(fn, wait){
    let canUse = true
    return function(){
        if(canUse){
            fn.apply(this, arguments)
            canUse = false;
            setTimeout(()=>canUse = true, wait)
        }
    }
}
