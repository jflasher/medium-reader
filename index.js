'use strict';

var request = require('request');
var xml2js = require('xml2js');

var createURL = function (name) {
  // Make sure name starts with @
  if (name[0] !== '@') {
    name = '@' + name;
  }

  return 'https://medium.com/feed/' + name;
};

var stripMediumHTML = function (html) {
  return html.replace(/<\/?[^>]+(>|$)/g, '')
             .replace('Continue reading on Medium »', '');
};

var parseItemsArray = function (items) {
  var finalArray = [];
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var parsedItem = {};
    parsedItem.title = item.title[0];
    parsedItem.description = item.description[0];
    parsedItem.plainDescription = stripMediumHTML(item.description[0]);
    parsedItem.link = item.link[0];
    parsedItem.pubDate = item.pubDate[0];
    finalArray.push(parsedItem);
  }

  return finalArray;
};

var getPosts = function (name, callback) {
  // Fail if we do not have a name
  if (name === undefined || name === '') {
    return callback('{ error: "no name provided" }');
  }

  var url = createURL(name);
  request.get(url, function (err, res, body) {
    if (err) {
      return callback('{ error: "problem connecting to Medium" }');
    }
    var parser = new xml2js.Parser();
    parser.parseString(body, function (err, result) {
      // Make sure result is ok
      if (err || !result || !result.rss || !result.rss.channel[0] || 
          !result.rss.channel[0].item) {
        return callback('{ error: "invalid result returned from Medium" }');
      }
      var parsedItems = parseItemsArray(result.rss.channel[0].item);
      callback(null, parsedItems);
    });
  });
};

module.exports = getPosts;