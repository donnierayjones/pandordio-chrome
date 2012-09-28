(function() {
  var PLAYLIST_NAME = 'Pandora';
  var PLAYLIST_DESC = 'Playlist automatically created by PandoRdio Chrome Extension';
  var playlistKey;

  var showNotification = function(title, text) {
    var notification = webkitNotifications.createNotification(
      'icon48.png',
      title,
      text
    );
    notification.show();
    setTimeout(function() {
      notification.cancel();
    }, 10000);
  };

  var createPlaylistWithTrack = function(trackKey) {
    rdio.createPlaylist({
      name: PLAYLIST_NAME,
      description: PLAYLIST_DESC,
      tracks: trackKey
    });
  };

  var addTrackToPlaylist = function(trackKey) {
    if(playlistKey !== undefined) {
      return rdio.addToPlaylist(playlistKey, trackKey);
    }
    rdio.getPlaylists(function(data) {
      var pandoraPlaylist = _.find(data.result.owned, function(playlist) {
        return playlist.name === PLAYLIST_NAME;
      });
      if(pandoraPlaylist === undefined) {
        createPlaylistWithTrack(trackKey);
      }
      else {
        playlistKey = pandoraPlaylist.key;
        rdio.addToPlaylist(playlistKey, trackKey);
      }
    });
  };

  var addTrackToMobile = function(trackKey) {
    rdio.setAvailableOffline(trackKey, true);
  };

  var searchHandler = function(trackData, searchResults, response) {
    if(searchResults.length < 1) {
      return showNotification('No Match Found', 'No match found in Rdio.');
    }

    var match = _.find(searchResults, function(t) {
      return t.type === 't' &&
        t.name.toLowerCase().indexOf(trackData.track.toLowerCase()) >= 0 &&
        t.artist.toLowerCase().indexOf(trackData.artist.toLowerCase()) >= 0;
    });

    if(!match) {
      return showNotification('No Exact Match Found', 'Match found in Rdio, but no exact match.');
    }

    rdio.addToCollection(match.key, function(data) {
      if(data.result === true) {
        // assuming if we could addToCollection, shouldn't need
        // to check for response in the following requests...
        addTrackToPlaylist(match.key);
        addTrackToMobile(match.key);
        return showNotification(match.name, 'by ' + match.artist + ' was added to your collection in Rdio.');
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
})();
