module.exports = function(pool){
	function addRegistrationId(id, callback){
		var sql = 'INSERT INTO gcmRegistrationIds (registrationId) VALUES (?)';
		var inserts = [id];
		pool.getConnection(function(err, connection){
			if (err){
				console.log(err);
				callback(err);
				return;
			}
			connection.query(sql, inserts, function(err, results){
				connection.release();
				if(err){
					console.log(err);
					callback(err);
					return;
				}
				callback(false, results);
			});
		});
	}

	return {
		addRegistrationId: addRegistrationId
	};
}