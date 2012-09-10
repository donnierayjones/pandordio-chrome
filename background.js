var searchHandler = function(trackData, searchResults, response) {
  if(searchResults.length < 1) {
    return response({
      result: 'matchError',
      errorMessage: 'No match found in Rdio.'
    });
  }

  var match = _.find(searchResults, function(t) {
    return t.name.toLowerCase().indexOf(trackData.track.toLowerCase()) >= 0 &&
    t.artist.toLowerCase().indexOf(trackData.artist.toLowerCase()) >= 0;
  });

  if(!match) {
    return response({
      result: 'matchError',
      errorMessage: 'Match found in Rdio, but no exact match.'
    });
  }

  rdio.addToCollection(match.key, function(data) {
    if(data.result === true) {
      rdio.setAvailableOffline(match.key, true, function(data) {
        // assuming if we could addToCollection, shouldn't need
        // to check data object for success here.
        return response({
          result: 'addedToCollection'
        });
      });
    } else {
      if(data.error.statusCode === 401) {
        return response({
          result: 'unauthenticated'
        });
      } else {
        return response({
          result: 'unhandledError',
          errorMessage: 'An unhandled error occurred.'
        });
      }
    }
  });
};

var requestHandlers = {
  thumbsUp: function(request, response) {
    rdio.search(
      request.trackData.track + ' ' + request.trackData.artist,
      'Track,Artist',
      function(data) { searchHandler(request.trackData, data.result.results, response); }
    );
  }
};

chrome.extension.onRequest.addListener(function(request, sender, response) {
  requestHandlers[request.action](request, response);
});
