function playerProgressBar(currentTime, duration)
{
		// Work out how much of the media has played via the duration and currentTime parameters
		var percentage = Math.floor((100 / duration) * currentTime);
		postMessage({'type': 'progress','value':percentage});
}

onmessage = function(e) {
    // the passed-in data is available via e.data
	//console.log(e.data.currentTime
	//if(e.data.currentTime && e.data.duration){
	playerProgressBar(e.data.currentTime, e.data.duration);
		//}
};

