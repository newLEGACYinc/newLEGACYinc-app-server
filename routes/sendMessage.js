module.exports = function(sender){
	return function(req,res){
		if (req.body.annouce_password === process.env.ANNOUNCE_PASSWORD){
			res.status(400).send('incorrect ')
		} else if (req.body.title && req.body.message){
			sender.send(req.body.title, req.body.message, 'announcements');
			res.send("ok");
		} else {
			res.status(400).send("missing title or message or data");
		}
	}
};