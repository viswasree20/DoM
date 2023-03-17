let usermsg,target,storage=[];
let data={
	get usermsg(){
		if(storage.indexOf(target)<0){
			storage.push(target);
		}
		return a;
	},
	set usermsg(Newvalue){
		a=Newvalue;
		storage.forEach(sub=> sub());
	}
}
const autoreply=updatechat=>{
	target=updatechat;
	target();
	target=null
}		
