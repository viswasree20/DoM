function fadein(val){
	let opacity=0;
	let interval=setInterval(function(){
		if(opacity<1){
			opacity+=0.2;
			val.style.opacity=opacity;
		}
		else{
			clearTimeout(interval);
		}
	},50)
}

function fadeout(val){
	let opacity=1;
	let interval=setInterval(function(){
		if(opacity>0){
			opacity-=0.2;
			val.style.opacity=opacity;
		}
		else{
			clearTimeout(interval);
			val.style.display="none";
		}
	},50)
}

function sendimage(){
		let file=this.files[0];
		console.log(file);
		let reader = new FileReader();
		reader.onloadend=()=>{
			let filesrc=reader.result;
			fetch("/upload",{
			method:"POST",
			body:filesrc//
		}).then(res=> res.json()).then(data=> console.log(data))
		}
		reader.readAsDataURL(file);

		/*let formdata= new FormData();
		formdata.append("sendimage",file,`${file.name}`)

		/* we can't directly console log the formdata value, use the entries property /
	    for (var key of formdata.entries()) {
	        console.log(key[0] + ', ' + key[1]);
	    
		console.log(formdata)*/
		
		//chatimagadd(file);
}

function topupmenu(){
	document.getElementById("profilelist").style.display="block";
	document.getElementById("user_profile_menu").style.height="50%";
}

let changepro=document.getElementById("changeprofile");
if(changepro!=undefined){
	let input=document.querySelector("#input_profile_pic");
	changepro.addEventListener("click",function(){
		input.click();
	})
	input.addEventListener("change",sendimage);
}


function postseen(queryobject) {
	console.log(queryobject)
	fetch("/chat/seen",{
		method:"POST",
		headers:{"content-type":"application/json"},
		body:JSON.stringify(queryobject)
	}).then(res=>res.json()).then(data=> console.log("seen the msg"))			
}

function changebtn(){
	if(this.value){
		document.getElementById("sendbtn_icon").innerText="send";
		document.getElementById("sendbtn_icon").style.color="grey";
		if(!hasMsg){
			hasMsg=true
			server.emit('addTypinguser',{typingstatus:true,tyingto:id.innerText})
		}
	}
	else{
		hasMsg=false
		server.emit('removeTypingUsers',{typingstatus:false,tyingto:""})
		document.getElementById("sendbtn_icon").innerText="keyboard_voice";
		
	}
}


function datestatus(){
	let date=new Date();
	/*let mon=date.getMonth();if(Mon){Mon+=1;};if(Mon<10){MM="0"+mon;}
	let day=date.getDate();if(dd<10){dd="0"+dd;};
	let year=date.getFullYear().toString().slice(2);*/
	let timezone="AM"
	let mm=date.getMinutes();if(mm<10){mm='0'+mm};
	let hh=date.getHours();if(hh<10){hh="0"+hh;};if(hh>12){timezone="PM";hh=hh-12;if(hh<10){hh="0"+hh;}}
	return `${hh}:${mm}:${timezone}`
}

function chatimagadd(file,userid,usertext,senduser) {
	//let file=this.files[0];
	console.log(file.name);
	let filetype=file.type;
	console.log(file.type);
	let validextensions=['image/jpg','image/jpeg','image/png','video/mp4'];
	let validextensionsvideo=['video/mp4'];
	
	if (validextensions.includes(filetype)) {
		let fileReader=new FileReader();
		fileReader.onloadend=()=>{
			let fileurl=fileReader.result;
			if(!validextensionsvideo.includes(filetype)){
				fetch("/chat/image",{
					method:"post",
					body:JSON.stringify({img:fileurl,text:usertext,id:userid.innerText})
				}).then(res=> res.json()).then(data=> console.log(data));
				tempmsg("Sendimage",fileurl)
				server.emit("sendimagert",{source:fileurl,text:usertext,to:userid.innerText,from:senduser,type:"image"})
			}
			else{
				fetch("/chat/video",{
					method:"post",
					body:JSON.stringify({video:fileurl,text:usertext,id:userid.innerText})
				}).then(res=> res.json()).then(data=> console.log(data));
				tempmsg("Sendvideo",fileurl)
				server.emit("sendvideort",{source:fileurl,text:usertext,to:userid.innerText,from:senduser,type:"video"})
			}
		}
		
		fileReader.readAsDataURL(file)
	}
}

function highlight(){
	let doc=document.getElementsByClassName("user-id");
	for(var i=0;i<doc.length;i++){
		console.log("count",i)
		if(doc[i].children[3].attributes[2].value=='Receive' && doc[i].children[3].attributes[1].value=='false'){
			doc[i].children[3].style.fontWeight=600;
			doc[i].children[3].style.color="black";
		}
	}
}


function clientside_onlinestatus_list(inputvalue){
	//let status=inputvalue.data.find(clients=> {return clients.userid==id.innerText})
	let mmm= document.getElementsByClassName("user-id");
	for(let ind=0;ind<mmm.length;ind++){
		let userlist=mmm[ind].children;
		let status=inputvalue.data.find(clients=> {return clients.userid==userlist[1].innerText})
		
		if(status!=undefined){
			if(userlist[1].innerText==status.userid && status.status=="green"){
				userlist[2].style.display="block";
				console.log(status)
			}
			else if(userlist[1].innerText==status.userid && status.status=="yellow"){
				userlist[2].style.display="none";
			}
		//Sconsole.log("mgd",mmm[ind].children[2].style.display="block")
		}
	}
}

function clientside_onlinestatus(inputvalue){
	let status=inputvalue.data.find(clients=> {return clients.userid==id.innerText})
	if(status!==undefined){
		if(status.userid==id.innerText && status.status=="green"){
			document.getElementById("online_status").innerHTML="online";
			console.log("green");
			

		}
		else if(status.userid==id.innerText && status.status=="yellow"){
			document.getElementById("online_status").innerHTML="offline";
		}
	}
}


function clientside_onlinestatus_typing(inputvalue){
	let status=inputvalue.data
	if(status.from==id.innerText && status.typing==true){
		document.getElementById("online_status").innerHTML="tying...";
		document.getElementById("online_status").style.textTranform="lowercase"
		console.log("green");
		

	}
	else if(status.from==id.innerText && status.typing==false){

		if(status.status=="yellow")	document.getElementById("online_status").innerHTML="offline";
		else document.getElementById("online_status").innerHTML="Online";
	}
}


function search(){
	document.getElementById("search").style.display="block";
	document.getElementById("search-icon").style.display="none";
}

function closetext(){
	document.getElementById('searchbar').value="";
	document.getElementById('search_output').innerHTML="";
	document.getElementById("search").style.display="none";
	document.getElementById("search-icon").style.display="block";	
}

function profilepic(){
	document.getElementById("full-profile-pic").style.display="block";
}

function closeimage(){
	document.getElementById("full-profile-pic").style.display="none";
}


var len=document.getElementsByClassName("opertion");

for(var ind=0;ind<len.length;ind++){
	len[ind].addEventListener("click",function(){
		switch(this.id){
			case "chat":
				this.style.borderBottom="3px solid";
				document.getElementById("livechat").style.borderBottom="";
				document.getElementById("status").style.borderBottom="";
				break;
			case "livechat":
				this.style.borderBottom="3px solid";
				document.getElementById("chat").style.borderBottom="";
				document.getElementById("status").style.borderBottom="";
				break;
			case "status":
				this.style.borderBottom="3px solid";
				document.getElementById("chat").style.borderBottom="";
				document.getElementById("livechat").style.borderBottom="";
				break;
			default:
				break;
		}
	})
}




function putnew_msg_Inlist(inputvalue,seen,format,weight,fontcolor,type){
	let chatList=document.getElementsByClassName("user-id");
	for(var ind=0;ind<chatList.length;ind++){
		let username=chatList[ind].children[1].innerHTML;
		console.log("hey user",username);
		let newmsg=chatList[ind].children[3];
		if(inputvalue.from_user==username||inputvalue.from==username){
			if(newmsg){
				if(type=="text"){
					newmsg.innerHTML=inputvalue.msg;
				}
				else{
					newmsg.innerHTML=type;	
				}
				newmsg.style.color=fontcolor;
				newmsg.style.fontWeight=weight;
				newmsg.attributes[1].value=seen
				newmsg.attributes[2].value=format;
			}
			else{
				if(type=="text"){
					let op=`<p id="lastmsg" data-seen="${seen}" data-msgformet="${format}">${inputvalue.msg}</p>`;
				}
				else{
					let op=`<p id="lastmsg" data-seen="${seen}" data-msgformet="${format}">${type}</p>`;	
				}
				chatList[ind].innerHTML+=op
			}
		}
	}
}

function option(){
	let val=document.getElementById("optionlist");
	val.style.display="block";
	fadein(val);

}
	

function optionout(){
	let val=document.getElementById("optionlist");
	fadeout(val);
}


function usermenu(){
	let val=document.getElementById("usermenu")
	val.style.display="block";
	fadein(val)
	
}
function usermenuout(){
	document.getElementById("usermenu").style.display="none";
}


function iconin() {
	let val=document.getElementById("menu-list");
	val.style.display="flex";
	fadein(val);
}

function iconout() {
	let val=document.getElementById("menu-list");
	fadeout(val);
}

function tempmsg(msgformet,value){
//	document.getElementsByClassName("Date").innerHTML=`<p class="datestr">Today</p>`
	const chat_area=document.getElementById("view");
	let div=document.createElement("div");
	let att=document.createAttribute("class");
	att.value=`${msgformet}`;
	div.attributes.setNamedItem(att);
	let span=document.createElement("span");

	if(msgformet=="Receive" || msgformet=="Send" || msgformet=="Receivetext" || msgformet=="Sendtext"){
		span.innerHTML+=`${value}`;
	}
	if(msgformet=="Receiveimage"||msgformet=="Sendimage"){
		console.log(value);
		span.innerHTML+=`<img src="${value}">`;
		console.log("imagethe")
	}
	if(msgformet=="Receiveaudio"||msgformet=="Sendaudio"){
		console.log(value);
		span.innerHTML+=`<audio controls><source src="${value}" type="audio/mpeg"></audio>`;
		console.log("audiothe")
	}
	if(msgformet=="Receivevideo"||msgformet=="Sendvideo"){
		console.log(value);
		span.innerHTML+=`<video controls><source src="${value}" type="video/mp4"></video>`;
		console.log("videothe")
	}
	
	span.innerHTML+=`<p id="chattime">${datestatus()}</p>`
	div.appendChild(span);
	//let tex=document.getElementById("chatarea");
	chat_area.appendChild(div);
	chat_area.scrollIntoView(false)
	/*if(text.value!==""){
		span.innerText=text.value;
	}*/
	
	document.getElementById("chatarea").value="";
	//div.style.width=(span.offsetWidth)+"px";
}


function mediasendws(inputvalue,media,mediaformet) {
	if(id!=undefined && id.innerText==inputvalue.data.msg.from){
		tempmsg(mediaformet,inputvalue.data.msg.source);
		putnew_msg_Inlist(inputvalue.data.msg,true,mediaformet,100,"rgb(100, 100, 100)",media);
		postseen({fromuser:inputvalue.data.msg.to,touser:inputvalue.data.msg.from})
	}
	else{
		let inputnotify="";
		inputnotify+=`<span>${inputvalue.data.msg.from}</span>`;
		let val=document.getElementById("msgnotify");
		val.style.display='block';
		fadein(val)
		let num=0;
		let count =setInterval(()=>{if(num==5){fadeout(val);clearTimeout(count)};num+=1;console.log(num)},1000)	
		val.innerHTML=inputnotify;
		putnew_msg_Inlist(inputvalue.data.msg,false,mediaformet,300,"black",media);
		highlight();
	}
}

let id=document.querySelector(".username");
const usl=`ws://localhost:8020/`
var hasMsg=false;

const server=new WebSocket(usl)
WebSocket.prototype.emit=(event,data)=>{
	server.send(JSON.stringify({event,data}))
}
server.onopen=function () {
	console.log("open socket")
	if(window.location.href != "http://localhost:8020/login"){
		console.log("window done")
		let user=document.getElementById("userprofile_userid").innerText;
		console.log(user)
		server.emit("thisuser",{userid:user,onlineStatus:"green"});
	}
}
server.onmessage=function (event) {
	console.log(event)
	const inputvalue=JSON.parse(`${event.data}`)
	/******** the websecket ("event.data") type is string,for this method i need an object,
	 ****** so i change the event.data type string into object***/  
	if(inputvalue.events=="all-user" && window.location.href!="http://localhost:8020/login"){
		clientside_onlinestatus_list(inputvalue)
	}
	if (id!=undefined && inputvalue.events=="user-tying") {
		clientside_onlinestatus_typing(inputvalue);
	}
	if (id!=undefined && inputvalue.events=="all-user") {
		clientside_onlinestatus(inputvalue);
	}
	if(inputvalue.events=="new-message"){
		
		if(id!=undefined && id.innerText==inputvalue.data.msg.from_user){
			tempmsg("Receive",inputvalue.data.msg.msg);
			putnew_msg_Inlist(inputvalue.data.msg,true,"Receive",100,"rgb(100, 100, 100)","text");
			postseen({fromuser:inputvalue.data.msg.to_user,touser:inputvalue.data.msg.from_user})
		}
		else{
			let inputnotify="";
			inputnotify+=`<span>${inputvalue.data.msg.from_user}</span>`;
			let val=document.getElementById("msgnotify");
			val.style.display='block';
			fadein(val)
			let num=0;
			let count =setInterval(()=>{if(num==5){fadeout(val);clearTimeout(count)};num+=1;console.log(num)},1000)	
			val.innerHTML=inputnotify;
			putnew_msg_Inlist(inputvalue.data.msg,false,"Receive",300,"black","text");
			highlight();
		}
	}

	if(inputvalue.events=="new-message_AUD"){
		mediasendws(inputvalue,"AUD","Receiveaudio")
	}

	if(inputvalue.events=="new-message_VID"){
		mediasendws(inputvalue,"Video","Receivevideo")
	}

	if(inputvalue.events=="new-message_IMG"){
		mediasendws(inputvalue,"Img","Receiveimage")
		/*if(id!=undefined && id.innerText==inputvalue.data.msg.from){
			tempmsg("Receiveimage",inputvalue.data.msg.img);
			putnew_msg_Inlist("img",true,"Receive",100,"rgb(100, 100, 100)");
			postseen({fromuser:inputvalue.data.msg.to,touser:inputvalue.data.msg.from})
		}
		else{
			let inputnotify="";
			inputnotify+=`<span>${inputvalue.data.msg.from_user}</span>`;
			let val=document.getElementById("msgnotify");
			val.style.display='block';
			fadein(val)
			let num=0;
			let count =setInterval(()=>{if(num==5){fadeout(val);clearTimeout(count)};num+=1;console.log(num)},1000)	
			val.innerHTML=inputnotify;
			putnew_msg_Inlist("img",false,"Receiveimage",300,"black");
			highlight();
		}*/
	}
	//server.emit("Receive",text)
}

function send() {

	let text=document.getElementById("chatarea").value;
	let user=document.getElementById("userprofile_userid").innerText;
	
	
	if(id.innerText=="" || text==""){
		console.log("sorry!.Id missing");
	}
	else{

		fetch("/chat-list/chat/"+`${id.innerText}`,{
			method:"POST",
			headers:{"content-type":"application/json"},
			body:JSON.stringify({text:text,id:id.innerText})
		}).then(res=> res.json()).then(data=> {
			console.log("data");
			let chatlist=data.chatlist;
			console.log(chatlist);
		//	location.reload();
		});
		tempmsg("Sendtext",text);
		putnew_msg_Inlist({from_user:id.innerText,msg:text,to_user:user},false,"Send",100,"rgb(100, 100, 100)","text")
		server.emit("Send",{from_user:user,msg:text,to_user:id.innerText})
	}
	document.getElementById("chatarea").value="";
	document.getElementById("sendbtn_icon").innerText="keyboard_voice";

}


console.log(window.location.href)


if(window.location.href!="http://localhost:8020/login"){
	window.addEventListener("focus",function(){
		server.emit("updateuserstatus","green");   
		console.log("green");
	})
	window.addEventListener("blur",function(){
		server.emit("updateuserstatus","yellow");
		console.log("yellow");
	})
	let cover = document.getElementById("cover-image");
	let profile = document.getElementById("profile-pic");
	cover.addEventListener("mouseover",function(){
		profile.style.left="100px";
	})
}

document.getElementById("fileimage").addEventListener("change",function(e){
	let file=this.files[0];
	console.log(file);

	/*fetch("/image",{
		method:"POST",
		headers:{"content-type":"application/json"},
		body:{}
	})*/

	let filetype=file.type;
	let validextensions=['image/jpeg','image/jpg','image/png']
	if (validextensions.includes(filetype)) {
		let fileReader=new FileReader();
		fileReader.onload=()=>{
			let fileurl=fileReader.result;
			console.log(fileurl)
			let imgtag=`<img src="${fileurl}" alt>`
			document.getElementById("profile-pic").innerHTML=imgtag;
			document.getElementById("userimage").src=fileurl;
		}
		fileReader.readAsDataURL(file);

	}
})

if(id!=undefined){
	console.log("test1",id);
	let text=document.getElementById("chatarea").value || "";
	let user=document.getElementById("userprofile_userid").innerText;
	let input=document.querySelector("#inputimage");
	let newcam=document.querySelector("#new_camera");
	let btncam = document.getElementById("camera");
	let cam = document.getElementById("cam_div");
	let vid = document.querySelector("#cam_screen");
	let camstop=document.querySelector("#cam_control_close");
	let snap=document.querySelector("#cam_control_click");
	let sEND = document.getElementById("sendbtn");
	let sendicon = document.getElementById("sendbtn_icon");
	let bufdata=[];
	let vidbuf=[];
	let count_time;
	let opencam,vidsize={},openaudio,mediaRecorder,blobimage,videorec,rec_status=false,vidrec_status=false;
	//chatimg sending
	document.getElementById("chatimage").addEventListener("click",function(){
		input.click();
	})
	input.addEventListener("change",function(){
		let file=this.files[0];
		chatimagadd(file,id,text,user);
	});

	document.getElementById("chatarea").addEventListener("keyup",changebtn)
	let elmnt=document.getElementById("view");
	elmnt.scrollIntoView(false)

	let chatlist=document.getElementsByClassName("user-id");
	for(var ind=0;ind<chatlist.length;ind++){
		if(id.innerHTML==chatlist[ind].children[1].innerHTML){
			let profile=document.getElementById("profile-pic").children[0].attributes[0].value
			let pro = chatlist[ind].children[0];
			let vpro=pro.children[0].attributes[1].value;
			profile=vpro
			console.log(profile)
			if(chatlist[ind].children[3]){
				if(chatlist[ind].children[3].attributes[0].value=="lastmsg"){
					chatlist[ind].children[3].attributes[1].value='true';
					let dataId=chatlist[ind].children[3].attributes[3].value;
					postseen({fromuser:user,dataid:dataId,touser:id.innerHTML})
				}
			}
		}
	}



	btncam.addEventListener("click",camdisplayon);
	newcam.addEventListener("click",camdisplayon);

	function camdisplayon(){
		cam.style.display="block";
		let camcon_width = 320;
		let camcon_height = 480;
		if(document.getElementById("cam_div")){
			camcon_width = document.getElementById("cam_div").offsetWidth;
			camcon_height = document.getElementById("cam_div").offsetHeight;
			//console.log("dasd",{camcon_width,camcon_height});
		}
		const constraintObj={
			audio:true,
			video: {
				facingMode:"user",
				width:{min:320,idea:camcon_width,max:1920},
				height:{min:480,idea:camcon_height,max:1080}
			}
		};
		opencam= navigator.mediaDevices.getUserMedia(constraintObj)
		opencam.then(devices=>{
			vid.srcObject=devices;
			vid.onloadedmetadata=ev=>{
				vid.muted=true;
				vid.play()
			}
			let {width, height}= devices.getTracks()[1].getSettings();
			console.log(`${width}x${height}`);
			vidsize={width, height};
			//console.log(vidsize)
		})
		.catch(err=> console.log(err));
	}
	function camdisplayoff() {
		opencam.then(devices=>{
			const tracks = devices.getTracks()
			tracks.forEach(event=>{
				event.stop();
			})
		})
		cam.style.display="none";
	}

	camstop.addEventListener("click",camdisplayoff)

	snap.addEventListener("click",function() {
		let count=0;

		if(rec_status==true){
			let count_time=setInterval(()=>{
				count+=1;
				let sum=count/60;
				//console.log("sum",count);
			},1000)	
		}

		else{
			camdisplayoff();

			document.getElementById("send_image_capture").style.display="block";
			const canvas=document.createElement("canvas");
			const at=document.createAttribute("class");
			at.value="sendimage";
			canvas.attributes.setNamedItem(at);
			const context=canvas.getContext("2d");
			canvas.width=vidsize.width||320;
			canvas.height=vidsize.height||480;
			
			//context.scale(0.75,0.75);
			context.drawImage(vid,0,0);
			//console.log("fg",context.getImageData());

			//const imageData=context.getImageData(0,0,vidsize.width,vidsize.height);
			//context.putImageData(imageData,0,0);

			console.log(canvas);
			canvas.toBlob((blob)=>{
				blobimage=blob;

			});

			let div=document.createElement("div");
			div.setAttribute("class","Send");
			div.appendChild(canvas);
			document.getElementById("sendbtn_icon").innerText="send";
			document.getElementById("send_image_capture").appendChild(canvas);
			document.getElementById("send_image_capture").style.display="block";
			document.getElementById("send_image_capture").style.height="auto";
			document.getElementById("send_image_capture").style.height="auto";
			document.getElementById("send_image_capture").style.padding="10px";
		}
	});

	snap.addEventListener("mousedown",function(){
		recoder=setTimeout(function(){
			document.getElementById("cam_control_click_circle").style.fontSize="48px";
			document.getElementById("cam_control_click_circle").style.color="red";
			vidrec_status=true;
		},500)
	});

	snap.addEventListener("mouseup",function(){

		if(rec_status==true){
			videorec.stop();
			document.getElementById("cam_control_click_circle").style.fontSize="50px";
			document.getElementById("cam_control_click_circle").style.color="rgb(200,200,200)";		
			videorec.ondataavailable=(ev)=>{
				console.log(ev);
				vidbuf.push(ev.data);
			};
			
			videorec.onstop=ev=>{
				let vibblob=new Blob(vidbuf,{'type':"video/mp4"});
				console.log(vibblob)
				vidbuf=[];
				let vfr=new FileReader;
				vfr.readAsDataURL(vibblob);
				vfr.onloadend=()=>{

					fetch("/chat/video",{
						method:"post",
						body:JSON.stringify({video:vfr.result,text:text,id:id.innerText})
					}).then(res=> res.json()).then(data=> console.log(data))

					tempmsg("Sendvideo",vfr.result);
					server.emit("sendvideort",{source:vfr.result,text:text,to:id.innerText,from:user,type:"video"});

				}
			}
			rec_status=true;
			vidrec_status=false;
		}

		if(vidrec_status==true && rec_status==false){
			opencam.then(devices=>{
				document.getElementById("cam_control_click_circle").style.fontSize="50px";
				document.getElementById("cam_control_click_circle").style.color="red"
				videorec=new MediaRecorder(devices);
				videorec.start();
				rec_status=true;
			})
		}

		else{
			clearTimeout(recoder);
		}

	});

	sEND.addEventListener("mousedown",function(){
		if(sendicon.innerText=="keyboard_voice"){
			//audio=document.createElement("audio");
			openaudio=navigator.mediaDevices.getUserMedia({audio:true,video:false});
			openaudio.then(devices=>{
				setTimeout(()=>{
				mediaRecorder=new MediaRecorder(devices);
				//console.log(mediaRecorder)
				mediaRecorder.start();
				//console.log(mediaRecorder)
				//console.log(mediaRecorder.state)
			},250);
			})
		}
	})

	sEND.addEventListener("mouseup",function(){

		if(sendicon.innerText=="send"){
			if(blobimage!=undefined){
				let fr=new FileReader;
				fr.onloadend=()=>{
					console.log(fr.result);
					
					fetch("/chat/image",{
						method:"post",
						body:JSON.stringify({img:fr.result,text:text,id:id.innerText})
					}).then(res=> res.json()).then(data=> console.log(data));

					let opi=`<div class="Sendimage"><span><img src="${fr.result}"></span></div>`
					document.getElementById("send_image_capture").style.display="none";
					document.getElementById("view").innerHTML+=opi;
					document.getElementById("view").scrollIntoView(false);
					server.emit("sendimagert",{source:fr.result,text:text,to:id.innerHTML,from:user,type:"image"})
				}
				fr.readAsDataURL(blobimage);
				
			}

		};

		if(sendicon.innerText=="keyboard_voice"){
			console.log(mediaRecorder);
			mediaRecorder.stop();
			console.log(mediaRecorder.state)
			mediaRecorder.ondataavailable=ev=>{
				bufdata.push(ev.data);
				console.log(ev);
				console.log(bufdata);
			}
			mediaRecorder.onstop=ev=>{
				let blob=new Blob(bufdata,{"type":"audio/webm"});
				console.log(bufdata);
				bufdata=[];

				/*const audio=document.createElement("audio");
				let audioURL=window.URL.createObjectURL(blob);
				console.log(blob);
				audio.setAttribute("src",audioURL);
				console.log(audio);
				audio.setAttribute("controls","controls")
				//audio.src=audioURL;
				document.getElementById("view").appendChild(audio);*/

				let afr=new FileReader;
				afr.onloadend=()=>{
					fetch("/chat/audio",{
						method:"post",
						body:JSON.stringify({audio:afr.result,id:id.innerText})
					})
					tempmsg("Sendaudio",afr.result);
					server.emit("sendaudiort",{source:afr.result,to:id.innerText,from:user,type:"audio"})
				}
				afr.readAsDataURL(blob);
			}
			openaudio.then(devices=>{
				const tracksaud = devices.getTracks()
				tracksaud.forEach(event=>{
					event.stop();
				})
			})
		}
	})


}

let doc=document.getElementsByClassName("user-id");
for(var i=0;i<doc.length;i++){
	console.log("count",i)
	if(doc[i].children[3]){
		if(doc[i].children[3].attributes[0].value=='lastmsg' && doc[i].children[3].attributes[2].value=='Receive' && doc[i].children[3].attributes[1].value=='false'){
			doc[i].children[3].style.fontWeight=600;
			doc[i].children[3].style.color="black";
		}
	}
}




//const user=document.getElementById("usermenu").children[0].innerText;
//console.log(user);
//server.emit("thisuser",{username:"user",onlineStatus:"green"});

