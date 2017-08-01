function getView(){
	return{
		h:document.documentElement.clientHeight,
		w:document.documentElement.clientWidth
	}
} 

function bind(obj,ev,fn){
	if(obj.addEventListener){
		obj.addEventListener(ev,fn,false);
	}else{
		obj.attachEvent("on"+ev,function(){fn.call(obj);});
	}
}

function addClass(obj,sClass){
	var aClass=obj.className.split(" ");
	if(!obj.className){
		obj.className=sClass;
		return;
	}
	for(var i=0;i<aClass.length;i++){
		if(aClass[i]===sClass){
			return;
		}
	}
	obj.className+=" "+sClass;
}

function removeClass(obj,sClass){
	var aClass=obj.className.split(" ");
	if(!obj.className){
		return;
	}
	for(var i=0;i<aClass.length;i++){
		if(aClass[i]===sClass){
			aClass.splice(i,1);
			obj.className=aClass.join(' ');
			break;
		}
	}
}

function fnLoad(){
	var oWelcome=document.getElementById("welcome");
	var iTimer=new Date().getTime();
	var oTimer=0;
	var bOff=false;
	bind(oWelcome,"transitionend",End);
	bind(oWelcome,"WebkitTransitionEnd",End);
	oTimer=setInterval(function(){
		if(new Date().getTime()-iTimer>=5000){
			bOff=true;
		}
		if(bOff){
			clearInterval(oTimer);
			oWelcome.style.opacity="0";
		}
	},1000);
	function End(){
		removeClass(oWelcome,'pageShow');
		fnTab();
	}	
}

function fnTab(){
	var oTabPic=document.getElementById("tabPic");
	var oPicList=document.getElementById("picList");
	var oNav=document.getElementsByTagName("nav")[0];
	var oAs=oNav.getElementsByTagName("a");
	var iNow=0;
	var iW=getView().w;
	var iX=0;
	var oTimer=0;
	var iStart=0;
	var iStartTouch=0;
	auto();
	fnScore();
	bind(oTabPic,'touchstart',fnStart);
	bind(oTabPic,'touchmove',fnMove);
	bind(oTabPic,'touchend',fnEnd);
	function auto(){
		oTimer=setInterval(function(){
			iNow++;
			iNow=iNow%oAs.length;
			tab();
		},2000);
	}
	function fnStart(ev){
		clearInterval(oTimer);
		oPicList.style.transition="none";
		ev=ev.changedTouches[0];
		iStartTouch=ev.pageX;
		iStart=iX;
	}
	function fnMove(ev){
		ev=ev.changedTouches[0];
		var iDis=ev.pageX-iStartTouch;
		iX=iStart+iDis;
		oPicList.style.WebkitTransform=oPicList.style.transform="translateX("+iX+"px)";
	}
	function fnEnd(ev){
		iNow=-Math.round(iX/iW);
		if(iNow<0){
			iNow=0;
		}
		if(iNow>oAs.length-1){
			iNow=oAs.length-1;
		}
		tab();
		auto();
	}
	function tab(){
		iX=-iNow*iW;
		oPicList.style.transition="0.5s";
		oPicList.style.WebkitTransform=oPicList.style.transform="translateX("+iX+"px)";
		for(var i=0;i<oAs.length;i++){
			removeClass(oAs[i],'active');
		}
		addClass(oAs[iNow],'active');
	}
}

function fnScore(){
	var oScore=document.getElementById("score");
	var aLi=oScore.getElementsByTagName('li');
	var arr=["很差","不太满意","一般","还可以","非常满意"];
	for(var i=0;i<aLi.length;i++){
		fn(aLi[i]);
	}
	function fn(aLi){
		var aNav=aLi.getElementsByTagName('a');
		var oInput=aLi.getElementsByTagName("input")[0];
		for(var i=0;i<aNav.length;i++){
			aNav[i].index=i;
			bind(aNav[i],'touchstart',function(){
				for(var i=0;i<aNav.length;i++){
					if(i<=this.index){
						addClass(aNav[i],"active");
					}else{
						removeClass(aNav[i],"active");
					}
					
				}
				oInput.value=arr[this.index];
			})
		}
	}
	fnIndex();
}

function fnInfo(oInfo,sInfo){
	oInfo.innerHTML=sInfo;
	oInfo.style.WebkitTransform="scale(1)";
	oInfo.style.opacity=1;
	setTimeout(function(){
		oInfo.style.WebkitTransform="scale(0)";
		oInfo.style.opacity=0;
	},1000)
}
function fnIndex(){
	var oIndex=document.getElementById("index");
	var oBtn=oIndex.getElementsByClassName("btn")[0];
	var oInfo=oIndex.getElementsByClassName("info")[0];
	var bScore=false;
	bind(oBtn,"touchend",fnEnd);
	function fnEnd(){
		bScore=fnScoreChecked();
		if(bScore){
			if(fnTag()){
				fnIndexOut();
			}else{
				fnInfo(oInfo,"给景区添加标签");
			}
		}else{
			fnInfo(oInfo,"给景区评分");
		}
	}
	function fnScoreChecked(){
		var oScore=document.getElementById("score");
		var oInp=oScore.getElementsByTagName("input");
		for(var i=0;i<oInp.length;i++){
			if(oInp[i].value==0){
				return false;
			}
		}
		return true;
	}
	function fnTag(){
		var oTag=document.getElementById("indexTag");
		var oInp=oTag.getElementsByTagName("input");
		for(var i=0;i<oInp.length;i++){
			if(oInp[i].checked){
				return true;
			}
		}
		return false;
	}
}

function fnIndexOut(){
	var oMask=document.getElementById("mask");
	var oIndex=document.getElementById("index");
	var oNew=document.getElementById("news");
	addClass(oMask,"pageShow");
	addClass(oNew,"pageShow");
	fnNews();
	setTimeout(function(){
		oMask.style.opacity=1;
		oIndex.style.WebkitFilter=oIndex.style.filter="blur(5px)";
	},14)
	setTimeout(function(){
		oNew.style.transition='0.5s';
		oMask.style.opacity=0;
		oIndex.style.WebkitFilter=oIndex.style.filter="blur(0px)";
		oNew.style.opacity=1;
		removeClass(oMask,"pageShow");
	},3000)
}

function fnNews(){
	var oNew=document.getElementById("news");
	var oInp=oNew.getElementsByTagName("input");
	var oInfo=oNew.getElementsByClassName("info")[0];
	oInp[0].onchange=function(){
		if(this.files[0].type.split("/")[0]=="video"){
			fnNewsOut();
		}else{
			fnInfo(oInfo,"请上传视频");
		}
	}
	oInp[1].onchange=function(){
		if(this.files[0].type.split("/")[0]=="image"){
			fnNewsOut();
		}else{
			fnInfo(oInfo,"请上传图片");
		}
	}
}
function fnNewsOut(){
	var oNew=document.getElementById("news");
	var oForm=document.getElementById("form");
	addClass(oForm,"pageShow");
	oNew.style.cssText="";
	removeClass(oNew,"pageShow");
	fnForm();
}

function fnForm(){
	var oForm=document.getElementById("form");
	var oOver=document.getElementById("over");
	var oFormTag=document.getElementById("formTag");
	var oLabel=oFormTag.getElementsByTagName("label");
	var oBtn=oForm.getElementsByClassName("btn")[0];
	var bOff=false;
	for(var i=0;i<oLabel.length;i++){
		bind(oLabel[i],"touchend",function(){
			addClass(oBtn,'submit');
			bOff=true;
		})
	}
	bind(oBtn,"touchend",function(){
		if(bOff){
			for(var i=0;i<oLabel.length;i++){
				oLabel[i].getElementsByTagName("input")[0].checked=false;
			}
			bOff=false;
			addClass(oOver,"pageShow");
			removeClass(oForm,"pageShow");
			removeClass(oBtn,"submit");
			fnOver();
		}
	})
}

function fnOver(){
	var oOver=document.getElementById("over");
	var oBtn=oOver.getElementsByTagName("input")[0];
	bind(oBtn,"touchend",function(){
		removeClass(oOver,"pageShow");
	})
}
