module.exports={
	ensureAuthenticated:function(req,res,next){
		if (req.isAuthenticated()){
			return next();
		}else{
			console.log("plase login");
			res.redirect("/login");
		}
	}
}