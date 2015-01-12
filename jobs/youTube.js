module.exports = function(sender){
	// library imports
	var moment = require('moment');
	var request = require('request');

	// private variables
	var KEY = 'youTube';
	var lastVideoTime = moment(); // time of last new video, initialized to server start

	/**
	 * New YouTube video? video underfined if no new video
	 * @param callback(error, video)
	 */
	function newVideo(callback){
		var options = {
			url: 'https://www.googleapis.com/youtube/v3/search',
			qs: {
				channelId: process.env.YOUTUBE_CHANNEL_ID,
				key: process.env.YOUTUBE_API_KEY,
				order: 'date',
				part: 'snippet',
				publishedAfter: lastVideoTime.format('YYYY-MM-DDTHH:mm:ssZ')
			}
		};
		request(options, function(error, response, body){
			if(!error && response.statusCode === 200){
				body = JSON.parse(body);
				var items = body['items'];
				var latestVideo = items[0];
				if (!latestVideo){
					callback(false, false);
					return;
				}
				var latestVideoInfo = latestVideo['snippet'];
				var latestVideoPublished = moment(latestVideoInfo['publishedAt']);
				if (latestVideoPublished.isAfter(lastVideoTime)){
					lastVideoTime = latestVideoPublished;
					return callback(false, latestVideo);
				} else {
					return callback(false, false);
				}
			} else {
				if (response) {
					console.error(response.statusCode);
				}
				console.error(error);
				return callback(error);
			}
		});
	}

	function notify(info){
		if (!info){
			console.error('no video info');
			return;
		}
		var title = 'New YouTube video!';
		var message = info.snippet.title;
		sender.send(title, message, {'videoID': info.id.videoId}, KEY);
	}

	function job(){
		newVideo(function(error, info){
			if (error){
				console.error(error);
				return;
			}
			if (info){
				notify(info);
			}
		});
	}

	return {
		job: job
	}
};