const LocalStrategy=require("passport-local").Strategy;
//const passport = require('passport')
const User=require("../models/users");
const config=require("../config/database");
const bcrypt=require("bcryptjs");


module.exports=function(passport){
	passport.use(
		new LocalStrategy({usernameField:"email"},(email,password,done)=>{
			User.findOne({email:email})
			.then(user=>{
				if(!user){
					//console.log("user not fonud");
					return done(null,false,{message:"incorrect email or password"});
				};
				bcrypt.compare(password,user.password,(err,isMatch)=>{
					if(err){console.log(err)};
					if(!isMatch){
						//console.log("incorrect password")
						return done(null,false,{message:"incorrect email or password"});
					}else{
						return done(null,user);
						console.log(user)
					}
				})
			})
			.catch(err=> console.log(err));
		})
	);
	passport.serializeUser((user,done)=>{
		done(null,user.id);
	});
	passport.deserializeUser((_id,done)=>{
		User.findById(_id,(err,user)=>{
			done(err,user)
		})
	})
};

