module.exports = function(sender){
	return function(req,res){
		if (req.body.title && req.body.message){
			sender.send(req.body.title, req.body.message, 'announcements');
			res.send("ok");
		} else {
			res.status(400).send("missing title or message");
		}
	}
};