/**
 * Ensures the client is using a secure connection (HTTPS instead of HTTP)
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports = function(req, res, next){
	if (req.secure){
		return next();
	}
	res.redirect('https://' + req.headers.host + req.url);
};