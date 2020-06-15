/**
 * Video control functions.
 *
 */

var VideoControl = function (video) {
  var self = this;
  self.video = video;
  var velFF= 800;//velocità di partenza 600 aggiungere calcola 200 in piu
  var velREW= 800;//velocità di partenza 600 aggiungere calcola 200 in piu
  var intervalFwd;
  var intervalRwd;

  return {
    playVideo: playVideo,
    pauseVideo: pauseVideo,
    stopVideo: stopVideo,
    mediaBackward: mediaBackward,
    mediaForward: mediaForward,
    mute: mute,
    unmute: unmute
  };

  function playVideo () {
    clearInterval(intervalRwd);
    clearInterval(intervalFwd);
    velFF=800;
    velREW= 800;
    self.video.play();
  }

  function pauseVideo () {
    clearInterval(intervalRwd);
    clearInterval(intervalFwd);

    self.video.pause();
  }

  function stopVideo () {
    self.video.currentTime = 0;
	self.video.pause();
    //pauseVideo();
    //clearAllScene();
    velFF=800;
    velREW= 800;

  }

  function mediaBackward () {
    clearInterval(intervalRwd);
    clearInterval(intervalFwd);
    self.video.pause();
    if (velREW===200){
      velREW=800;
    }
    velREW=velREW-200;
    intervalRwd = setInterval(function () { windBackward(self.video); }, velREW);
    return velREW;
  }

  function mediaForward () {
    clearInterval(intervalRwd);
    clearInterval(intervalFwd);
    self.video.pause();
    if (velFF===200){
      velFF=800;
    }
    velFF=velFF-200;
    intervalFwd = setInterval(function () { windForward(self.video); }, velFF);
    return velFF;
  }

  function windBackward () {
    if (self.video.currentTime <= 1) {
      self.video.pause();
    } else {
      self.video.currentTime -= 1;
    }
  }

  function windForward () {
    if (self.video.currentTime >= self.video.duration - 1) {
      self.video.pause();
    } else {
      self.video.currentTime += 1;
    }
  }

  function mute () {
    self.video.muted = true;
  }

  function unmute () {
    self.video.muted = false;
  }


}
