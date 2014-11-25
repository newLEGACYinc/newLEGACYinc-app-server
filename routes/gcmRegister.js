module.exports = function(db){
	return function(req, res){
		var registrationId = req.body.registrationId;
		db.gcm.addRegistrationId(registrationId, function(err, results){
			if (err){
				console.log(err);
				return;
			}
			res.send('Ok');
		});
	};
};

