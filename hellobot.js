var Promise = require('bluebird');
var giphy = require('giphy-wrapper')('dc6zaTOxFJmzC');

var findGiphy = function(searchTerm) {
 var offset = Math.floor(Math.random()* 1000)
 return new Promise(function(resolve, reject) {
		 giphy.search(searchTerm, 25, offset, function (err, data) {
		    if (err) {
		      console.log(err);
		      return reject(err);
		    }
		 
		    var gifs = data.data;
		    var gif = gifs[Math.floor(Math.random()*gifs.length)];
		    console.log(gif);		    
 			return resolve(gif.url);
		  });
	});
};

module.exports = function (req, res, next) {
  var userName = req.body.user_name;
  // avoid infinite loop
  if (userName !== 'slackbot' && req.body.text.indexOf('crap') > -1) {
    return findGiphy('awesome')
	.then(function(gif) {
		  var botPayload = {
		    text : 'Damn, ' + userName + ' you are awesome! ' + gif,
                    icon_emoji: ":wink:"
		  };

		  console.log("Got gif: " + gif);
		  return res.status(200).json(botPayload);
	});
  } else {
    return res.status(200).end();
  }
}
