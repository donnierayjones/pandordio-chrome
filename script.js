$(function() {

  var responseHandlers = {
    'unauthenticated': function(res) {
      var confirmed = confirm('Allow PandoRdio to add to your Rdio collection');
      if(confirmed) {
        window.open('http://pandordio.herokuapp.com');
      }
    }
  };

  var handleResponse = function(res) {
    responseHandlers[res.result](res);
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
