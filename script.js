$(function() {

  var handleResponse = function(res) {
    if(!res.successful) {
      alert(res.errorMessage);
    }
  };

  var pandoRdio = {

    getTrackData: function() {
      return {
        artist: $('.artistSummary').text(),
        track: $('.songTitle').text(),
        album: $('.albumTitle').text()
      };
    },

    sendTrackDataToBackground: function() {
      chrome.extension.sendRequest({
        action: 'thumbsUp',
        trackData: this.getTrackData()
      }, handleResponse);
    }
  };

  $('#playbackControl').on('click', '.thumbUpButton', function() {
    pandoRdio.sendTrackDataToBackground();
  });

});
