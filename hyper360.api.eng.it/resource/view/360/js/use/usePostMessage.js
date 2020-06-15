/**
 * postMessage send/receive
 *
 */

/**
 * Send message to frontend.
 *
 */
function sendMessage (data) {
	if(typeof(postmsgparam) !== "undefined") {
		if(postmsgparam !== "false"){
			 window.parent.postMessage(data, '*');
		}
	}else{ //default: send post message
		window.parent.postMessage(data, '*');
	}
}

/**
 * Receive message from frontend
 * NOTE: videoControl must be declared in the global namespace (in the main js file)
 */
var intervalRewind;
function receiveMessage (event) {
  if (event.data && event.data.type !== 'time') {
    var message;
    if (event.data) {
      message = event.data
    } else {
      message = {}
      return
    }
    //console.log(message);
    if(intervalRewind){
      clearInterval(intervalRewind);
    }
    switch (message.type) {
      case 'goto':
        cleaningEngine(message.time, function (err,result) {
          if(result){
            video.playbackRate = 1.0;
            video.currentTime = message.time;
            //video.pause();
          }
        });
        break;
      case 'play':
        cleaningEngine('', function (err,result) {
          if(result){
            videoControl.playVideo()
          }
        });

        break
      case 'pause':
        videoControl.pauseVideo()
        break
      case 'forward':
        cleaningEngine('', function (err,result) {
          if(result){
            videoControl.mediaForward();
          }
        });

        break
      case 'backward':
        cleaningEngine('', function (err,result) {
          if(result){
            videoControl.mediaBackward();
          }
        });
        break
      case 'stop':
        videoControl.stopVideo()
        /*if (typeof boxObjects3D != 'undefined') {
          scene.remove(boxObjects3D[sequence])
        }
        sequence = 0*/
        break
      case 'mute':
        videoControl.mute()
        break
      case 'unmute':
        videoControl.unmute()
        break
      default:
        break;
    }
  }
}
