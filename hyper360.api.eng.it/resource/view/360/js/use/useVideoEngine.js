function videoBeahaviourOnTopFromProperties(properties, objListener){
	if (properties.vo) {
		if (properties.vo.ontop) {
			if (!document.getElementById(properties.id + 'useboxvideo')) { //first insert
				console.log("creo prima volta ")
				var boxvideo = document.createElement('div');
				boxvideo.style.display = 'block';
				boxvideo.id = properties.id + 'useboxvideo';
				boxvideo.style.width = properties.width + 'px';
				boxvideo.style.height = properties.height + 'px';
				var videocontainer = document.getElementById('container');
				videocontainer.appendChild(boxvideo);
				
				var video = document.createElement('video');
				video.style.position = 'absolute';
				video.itemid = properties.id;
				video.loop = properties.loop;
				video.width=properties.width;
				video.height=properties.height;
				video.src = properties.pathresource;
				video.crossOrigin = 'anonymous';
				if (properties.stopback===true){
				video.addEventListener("play", objListener.playListenerVideo2D);
				video.addEventListener("playing", objListener.playListenerVideo2D);
				video.addEventListener("pause", objListener.pauseListenerVideo2D);
				video.addEventListener("ended", objListener.endedListenerVideo2D);
				}
				video.setAttribute('controls','controls');
				video.pause();
				video.autoplay = properties.autoplay;
				boxvideo.appendChild(video);
				if(properties.autoplay === true){
					video.play();
				}
				usePositionAdjust(properties,boxvideo);
			}
		}
	}
}


function videoBeahaviourOnTopHideFromProperties(properties) {
	var element = document.getElementById(properties.id + 'useboxvideo');
	if (element) {
		element.parentNode.removeChild(element);
	}
}

function usePositionAdjust(properties,boxvideo){
	if (properties.vo.ontopoptionshor === 'left' && properties.vo.ontopoptionsver === 'top') {
		boxvideo.className=imageEngineClassNameFromProperties(properties);
		boxvideo.style.marginLeft = '0px';
		boxvideo.style.marginTop = '0px';
	} else if (properties.vo.ontopoptionshor === 'right' && properties.vo.ontopoptionsver === 'top') {
		boxvideo.className=imageEngineClassNameFromProperties(properties);
		boxvideo.style.marginLeft = '0px';
		boxvideo.style.marginTop = '0px';
	} else if (properties.vo.ontopoptionshor === 'center' && properties.vo.ontopoptionsver === 'top') {
		boxvideo.className=imageEngineClassNameFromProperties(properties);
		boxvideo.style.marginLeft = '-'+(properties.width/2)+'px';
		boxvideo.style.marginTop = '0px';
	} else if (properties.vo.ontopoptionshor === 'left' && properties.vo.ontopoptionsver === 'bottom') {
		boxvideo.className=imageEngineClassNameFromProperties(properties);
		boxvideo.style.marginLeft = '0px';
		boxvideo.style.marginTop = '0px';
	} else if (properties.vo.ontopoptionshor === 'right' && properties.vo.ontopoptionsver === 'bottom') {
		boxvideo.className=imageEngineClassNameFromProperties(properties);
		boxvideo.style.marginLeft = '0px';
		boxvideo.style.marginTop = '0px';
	} else if (properties.vo.ontopoptionshor === 'center' && properties.vo.ontopoptionsver === 'bottom') {
		boxvideo.className=imageEngineClassNameFromProperties(properties);
		boxvideo.style.marginLeft = '-'+(properties.width/2)+'px';
		boxvideo.style.marginTop = '0px';
	} else if (properties.vo.ontopoptionshor === 'left' && properties.vo.ontopoptionsver === 'middle') {
		boxvideo.className=imageEngineClassNameFromProperties(properties);
		boxvideo.style.marginLeft = '0px';
		boxvideo.style.marginTop = '-'+(properties.height/2)+'px';
	} else if (properties.vo.ontopoptionshor === 'right' && properties.vo.ontopoptionsver === 'middle') {
		boxvideo.className=imageEngineClassNameFromProperties(properties);
		boxvideo.style.marginLeft = '0px';
		boxvideo.style.marginTop = '-'+(properties.height/2)+'px';
	} else if (properties.vo.ontopoptionshor === 'center' && properties.vo.ontopoptionsver === 'middle') {
		boxvideo.className=imageEngineClassNameFromProperties(properties);
		boxvideo.style.marginLeft = '-'+(properties.width/2)+'px';
		boxvideo.style.marginTop = '-'+(properties.height/2)+'px';
	}
}