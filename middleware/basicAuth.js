module.exports = function(secrets){
	return function(req, res, next){
		if(req.body.password === secrets.password) {
			next();
		} else {
			next("non-existent or incorrect password");
		}
	}
};