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
			connection.query(sql, inserts, function(err, result){
				connection.release();
				if(err){
					console.log(err);
					callback(err);
					return;
				}
				callback(false, result);
			});
		});
	}

	function getRegistrationIds(callback){
		var sql = 'SELECT (registrationId) from gcmRegistrationIds';
		pool.getConnection(function(err, connection){
			if (err){
				console.log(err);
				callback(err);
				return;
			}
			connection.query(sql,[],function(err, rows, fields){
				connection.release();
				if (err){
					console.log(err);
					callback(err);
					return;
				}
				callback(false, rows);
			});
		})
	}

	return {
		addRegistrationId: addRegistrationId
	};
}