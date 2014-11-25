module.exports = function(db){
	return function(req, res){
		var registrationId = req.registrationId;
		db.gcm.addRegistrationId(registrationId, function(err, results){
			if (err){
				console.log(err);
				return;
			}
			console.log(results);
		});
	};
};

