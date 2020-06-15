function playerTime(currentTime, minutes, seconds, duration)
{
	var m;
	var s;
	if(duration > 60){
		m = Math.floor(currentTime / 60);
		s = Math.floor(currentTime % 60);
	}else{
		m = 0;
		s = Math.floor(currentTime % 60);
	}
	var sec = parseFloat(seconds);
	if (s < 10) {
		s = '0' + s;
	}
	var time = m + ':' + s + '/' + minutes + ':' + (sec.toFixed(0) >= 10 ? sec.toFixed(0) : ('0'+sec.toFixed(0)));
	postMessage({'type': 'currenttime','value':time});
}

onmessage = function(e) {
    // the passed-in data is available via e.data
	//console.log(e.data.currentTime
	playerTime(e.data.currentTime, e.data.minutes, e.data.seconds, e.data.duration);
	
};

