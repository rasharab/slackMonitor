var Promise = require('bluebird');
var giphy = require('giphy-wrapper')('dc6zaTOxFJmzC');
var _ = require('lodash');
var kwfilter = require('keyword-filter');

var filter = new kwfilter();
var searchTerms = ['crap', 'fuck', 'deploy', 'fixed'];
filter.init(searchTerms);

var findGiphy = function(searchTerm) {
 var offset = Math.floor(Math.random()* 5000)
 return new Promise(function(resolve, reject) {
		 giphy.search(searchTerm, 25, offset, function (err, data) {
		    if (err) {
		      console.log(err);
		      return reject(err);
		    }
		 
		    var gifs = data.data;
		    var gif = gifs[Math.floor(Math.random()*gifs.length)];
 		    return resolve(gif.url);
		  });
	});
};

module.exports = function (req, res, next) {
  var userName = req.body.user_name;
  // avoid infinite loop
  if (userName !== 'slackbot' && filter.hasKeyword(req.body.text)) {
    return findGiphy('awesome')
	.then(function(gif) {
		  var botPayload = {
		    text : 'Damn, ' + userName + ' you are awesome! ' + gif,
                    icon_emoji: ":wink:"
		  };

		  return res.status(200).json(botPayload);
	});
  } else {
    return res.status(200).end();
  }
}
