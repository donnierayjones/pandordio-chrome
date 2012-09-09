var searchHandler = function(trackData, searchResults, response) {
  if(searchResults.length < 1) {
    return response({
      successful: false,
      errorMessage: 'No match found in Rdio.'
    });
  }

  var match = _.find(searchResults, function(t) {
    return t.name.toLowerCase().indexOf(trackData.track.toLowerCase()) >= 0 &&
    t.artist.toLowerCase().indexOf(trackData.artist.toLowerCase()) >= 0
  });

  if(!match) {
    return response({
      successful: false,
      errorMessage: 'Match found in Rdio, but no exact match.'
    });
  }

  rdio.addToCollection(match.key, function(wasAdded) {
    if(wasAdded === true) {
      rdio.setAvailableOffline(match.key, true, function() {
        return response({successful: true});
      });
    } else {
      return response({
        successful: false,
        errorMessage: 'There was an error adding to your collection. Are you logged in?'
      });
    }
  });
};

var requestHandlers = {
  thumbsUp: function(request, response) {
    rdio.search(
      request.trackData.track + ' ' + request.trackData.artist,
      'Track,Artist',
      function(data) { searchHandler(request.trackData, data.results, response); }
    );
  }
};

chrome.extension.onRequest.addListener(function(request, sender, response) {
  requestHandlers[request.action](request, response);
});
