window.onload = function(){
    $('.none').remove();
};

if(window.location.href.indexOf('userId') != -1){
    var userId = window.location.href.split('userId=')[1].match(/[^#\?&]+/)[0];
}

var params = {"userId":userId};
var award = {
    A :2,
    B :3,
    C :4,
    D :5,
    E :6
};
var mask = {
    2 : '<div class="mask"><img src="images/p_vr.png" alt=""/></div>',
    3 : '<div class="mask"><img src="images/p_jd.png" alt=""/></div>',
    4 : '<div class="mask"><img src="images/p_jd100.png" alt=""/></div>',
    5 : '<div class="mask"><img src="images/p_66.png" alt=""/></div>',
    6 : '<div class="mask"><img src="images/p_88.png" alt=""/></div>',
    7 : '<div class="mask"><img src="images/p_i7.png" alt=""/></div>',
};
var awardNum = 0;
var bol = false;

//share份额[数字没有默认],
//speed速度[单位s,最小0.1s],
//velocityCurve速度曲线[linear匀速，ease慢快慢，ease-in慢慢开始，ease-out慢慢结束，ease-in-out慢快慢等，用的是css3的速度曲线],可以不写，ease默认值；
//callback回调函数
//weeks几周[默认2周，可以不写]
function rotateFun(obj,jsn){
    "use strict";
    this.draw = {};
    this.draw.obj = $(obj);
    this.draw.objClass = $(obj).attr("class");
    this.draw.newClass = "rotary"+"new"+parseInt(Math.random()*1000);
    var _jiaodu = parseInt(360/jsn.share);
    var _yuan = 360*(jsn.weeks || 4);
    var _str = "";
    var _speed = jsn.speed || "2s";
    var _velocityCurve = jsn.velocityCurve || "ease";
    var _this = this;
    for(var i=1;i<=jsn.share;i++)
    {
        _str+="."+this.draw.newClass+i+"{";
        _str+="transform:rotate("+((i-1)*_jiaodu+_yuan)+"deg);";
        _str+="-ms-transform:rotate("+((i-1)*_jiaodu+_yuan)+"deg);";
        _str+="-moz-transform:rotate("+((i-1)*_jiaodu+_yuan)+"deg);";
        _str+="-webkit-transform:rotate("+((i-1)*_jiaodu+_yuan)+"deg);";
        _str+="-o-transform:rotate("+((i-1)*_jiaodu+_yuan)+"deg);";
        _str+="transition: transform "+_speed+" "+_velocityCurve+";";
        _str+="-moz-transition: -moz-transform "+_speed+" "+_velocityCurve+";";
        _str+="-webkit-transition: -webkit-transform "+_speed+" "+_velocityCurve+";";
        _str+="-o-transition: -o-transform "+_speed+" "+_velocityCurve+";";
        _str+="}";
        _str+="."+this.draw.newClass+i+"stop{";
        _str+="transform:rotate("+((i-1)*_jiaodu)+"deg);";
        _str+="-ms-transform:rotate("+((i-1)*_jiaodu)+"deg);";
        _str+="-moz-transform:rotate("+((i-1)*_jiaodu)+"deg);";
        _str+="-webkit-transform:rotate("+((i-1)*_jiaodu)+"deg);";
        _str+="-o-transform:rotate("+((i-1)*_jiaodu)+"deg);";
        _str+="}";
    };
    $(document.head).append("<style>"+_str+"</style>");
    _speed = _speed.replace(/s/,"")*1000;
    this.draw.startTurningOk = false;
    this.draw.goto=function(index){
        if(_this.draw.startTurningOk){return false};
        _this.draw.obj.attr("class",_this.draw.objClass+" "+_this.draw.newClass+index);
        _this.draw.startTurningOk = true;
        setTimeout(function(){
            _this.draw.obj.attr("class",_this.draw.objClass+" "+_this.draw.newClass+index+"stop");
            if(jsn.callback)
            {
                _this.draw.startTurningOk = false;
                jsn.callback(index);
            };
        },_speed+10);
        return _this.draw;
    };
    return this.draw;
}

var newdraw = new rotateFun('.drawBtn',{
    share:6,
    speed:"3s",
    velocityCurve:"ease",
    weeks:6,
    callback:function(i){
        $(mask[i]).appendTo($('.wrap'));
        bol = false;
    }
});

$.post('https://app.ailibuli.cn/InvestUserAward/getAwardInfo',params,function(data){
    if(data.code == 400){
        $('.tips').text(data.msg);
    }else{
        awardNum = data.data.awardNumber;
        $('.tips').text('您有'+awardNum+'次抽奖机会');
        if(data.data.iphoneNumber>0){
            $(mask[7]).appendTo($('.wrap'));
        }
    }
});

$('.btnFont').on('click',function(){
    if(awardNum <= 0){
        $('<div class="mask"><div class="toast"><div class="words"><div>提示</div><div>您还未拥有抽奖机会</div></div><div class="sure">确定</div></div></div>').appendTo($('.wrap'));
        return;
    }
    if(bol)return;
    bol = true;
    $.post('https://app.ailibuli.cn/InvestUserAward/getAwardResult',params,function(data){
        if(data.code == 400){
            $('.tips').text(data.msg);
        }else{
            newdraw.goto(award[data.data.awardResult]);
            awardNum--;
            $('.tips').text('您有'+awardNum+'次抽奖机会');
        }
    })
})

$('.wrap').on('click','.mask',function(){
    $(this).remove();
})