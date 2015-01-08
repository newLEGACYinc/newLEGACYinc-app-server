module.exports = function(secrets){
	return function(req, res, next){
		if(req.headers.password === secrets.password) {
			next();
		} else {
			console.error(req);
			next("non-existent or incorrect password");
		}
	}
};