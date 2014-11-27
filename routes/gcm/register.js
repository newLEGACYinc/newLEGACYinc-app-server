module.exports = function(db){
	return function(req, res){
		var id = req.body.id;
		db.gcm.addRegistrationId(id, function(err, results){
			if (err && err.code !== 'ER_DUP_ENTRY'){
				console.log(err);
				return res.status(500).send(err);
			}
			return res.status(200).send('Ok');
		});
	};
};