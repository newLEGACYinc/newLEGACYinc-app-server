module.exports = function(secrets){
	return function(req, res, next){
		if(req.headers.password === secrets.password) {
			next();
		} else {
			next("non-existent or incorrect password");
		}
	}
};