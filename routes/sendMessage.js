module.exports = function(sender, secrets){
	return function(req,res){
		if (req.body.annouce_password === secrets.announce_password){
			res.status(400).send('incorrect ')
		} else if (req.body.title && req.body.message && req.body.data){
			sender.send(req.body.title, req.body.message, req.body.data, 'announcements');
			res.send("ok");
		} else {
			res.status(400).send("missing title or message or data");
		}
	}
};