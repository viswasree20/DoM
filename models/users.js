const mongoose=require("mongoose");

let userschema=mongoose.Schema({
	firstname:{
		type:String,
		requried:true
	},
	lastname:{
		type:String,
		requried:true
	},
	username:{
		type:String,
		requried:true
	},
	gender:{
		type:String,
		requried:true
	},
	Date_of_Birth:{
		date:{
			type:Number,
			requried:true
		},
		month:{
			type:Number,
			requried:true
		},
		year:{
			type:Number,
			requried:true
		}
	},
	picture:{
		profile:{
			type:String,
		}
	},
	phonenumber:{
		type:Number,
		requried:true
	},
	email:{
		type:String,
		requried:true
	},
	password:{
		type:String,
		requried:true	
	},
	chatlist:[{
		_id:"",
		username:{
			type:String
		},
		msg:[{
			id:{type:Number,requried:true},
			formet:String,
			msgformet:String,
			msgtext:String,
			Date:{type:String,requried:true},
			seen:{type:Boolean,requried:true},
			seen_time:{type:String,requried:true}
		}]
	}],
})

let User=module.exports=mongoose.model("User",userschema);