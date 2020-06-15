function playerActivity(timeInactivity) {
    if (timerID===undefined){
		timerID=setTimeout(timeToStop,timeInactivity);
	}else {
		clearTimeout(timerID);
		timerID=setTimeout(timeToStop,timeInactivity);
	}
  }

  function timeToStop(){
    postMessage({
        type: "timeToStop",
        item: timerID
      });
  }

  var timerID;
  onmessage = function(e) {
    // the passed-in data is available via e.data
    //console.log(e.data.currentTime
    if (e.data.timeInactivity) {
        playerActivity(e.data.timeInactivity);
    }
  };
  