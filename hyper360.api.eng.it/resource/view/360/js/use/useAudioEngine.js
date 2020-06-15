function audioBeahaviourOnTopFromProperties(
	properties,
	data, 
	containerHeight,
	containerWidth){
	if (properties.vo) {
		if (properties.vo.ontop) {
			if (!document.getElementById(properties.id + 'overlay')) { //first insert
				var audio = document.createElement('audio');
				audio.id = properties.id + 'overlay';
				audio.style.position = 'absolute';
				audio.autoplay = properties.autoplay ? true : false
				audio.itemid = properties.id;
				audio.loop = properties.loop;
				audio.src = properties.audioPath;
				audio.crossOrigin = 'anonymous';
				audio.setAttribute('controls','controls');
				var audiocontainer = document.getElementById('container');
				audiocontainer.appendChild(audio);
				if(properties.vo.free2d === true){ //free2d
					audio.style.position = 'relative';
					var tempx = parseInt(properties.vo.x2d);
					var tempy = parseInt(properties.vo.y2d);
					var temptop = parseInt(data.envinronmentHeight);
					var templeft = parseInt(data.envinronmentWidth);
			
					var yRelative = (tempy * parseInt(containerHeight))/temptop;
					var xRelative = (tempx * parseInt(containerWidth))/templeft;
					//console.log(yRelative);
					//console.log(xRelative);
					//img.style.left = properties.vo.x2d+'px';
					//img.style.top = properties.vo.y2d+'px';
					audio.style.left = xRelative+'px';
					audio.style.top = yRelative+'px';
				}else{
					useAudioPositionAdjust(properties, audio);
				}
			}else if(properties.vo.free2d === true){ //free2d
				var audio = document.getElementById(properties.id + 'overlay');
				audio.style.position = 'fixed';
			
				var tempx = parseInt(properties.vo.x2d);
				var tempy = parseInt(properties.vo.y2d);
				var temptop = parseInt(data.envinronmentHeight);
				var templeft = parseInt(data.envinronmentWidth);
			
				var yRelative = (tempy * parseInt(containerHeight))/temptop;
				var xRelative = (tempx * parseInt(containerWidth))/templeft;
				audio.style.left = xRelative+'px';
				audio.style.top = yRelative+'px';
				audio.style.zIndex = properties.vo.depth;
				
				/*var widthDyn = (img.width*parseInt(containerWidth))/templeft;
				var heightDyn = (img.height*parseInt(containerHeight))/temptop;
		        audio.width = widthDyn;
		        audio.height = heightDyn;*/
			}
		}
	}
}


function audioBeahaviourOnTopHideFromProperties(properties) {
	var element = document.getElementById(properties.id + 'overlay');
	if (element) {
		element.parentNode.removeChild(element);
	}
}

function useAudioPositionAdjust(properties,boxvideo){
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

/*
* RESIZING OBJECT AFTER WINDOW RESIZE
*/
function audioOnTopResizeFromProperties(
	properties,
	data,
	containerHeight,
	containerWidth
  ) {
	//It's just the overlay of html components overlay out of the scene
	if (properties.vo.ontop && properties.vo.free2d === true) {
		var audio = document.getElementById(properties.id + 'overlay');
		audio.style.position = 'absolute';
		var tempx = parseInt(properties.vo.x2d);
		var tempy = parseInt(properties.vo.y2d);
		var temptop = parseInt(data.envinronmentHeight);
		var templeft = parseInt(data.envinronmentWidth);
		var yRelative = (tempy * parseInt(containerHeight))/temptop;
		var xRelative = (tempx * parseInt(containerWidth))/templeft;
		audio.style.left = xRelative+'px';
	}
  }