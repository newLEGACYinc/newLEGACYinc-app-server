module.exports = function(db){
	// library import
	var util = require('util');

	return function settingsGet(req, res){
		var id = req.headers.id;
		var type = req.headers.type;

		// if id or type are missing
		if(!id || !type){
			res.status(400).send(
				util.format("Device ID and type Required. Got %s:%s",
					id, type)
			);
			return;
		}

		db.settings.get(id, type, function(err, settings){
			if (err){
				console.log(err);
				res.status(500).send(err);
				return;
			}
			res.status(200).send(settings);
		});
	}
};