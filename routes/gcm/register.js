module.exports = function(db){
	return function(req, res){
		var registrationId = req.body.registrationId;
		db.gcm.addRegistrationId(registrationId, function(err, results){
			if (err && err.code !== 'ER_DUP_ENTRY'){
				console.log(err);
				return res.status(500).send(err);
			}
			return res.status(200).send('Ok');
		});
	};
};

