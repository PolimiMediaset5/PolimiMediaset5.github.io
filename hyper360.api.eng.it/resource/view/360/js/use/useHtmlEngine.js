function htmlpageBeahaviourOnTopFromProperties(properties){
	if (properties.vo) {
		if (properties.vo.ontop) {
			var boxdiv;
			if (!document.getElementById(properties.id)) { //first insert
				var htmlpagecontainer = document.getElementById('container');
				boxdiv = document.createElement('div');
				boxdiv.style.display = 'block';
				boxdiv.style.width = properties.width + 'px';
				boxdiv.style.height = properties.height + 'px';
				boxdiv.id = properties.id + 'boxiframe';
				htmlpagecontainer.appendChild(boxdiv);

				if (properties.cover) {
					var img = document.createElement('img');
					img.className = 'center';
					img.properties = properties;
					img.id = properties.id;
					boxdiv.appendChild(img);
					img.style.display = 'block';
					img.style.objectFit='contain';
					if (properties.covertype === 'marker') {
						img.src = domain+'/resources/video/assets/marker.png';
					} else {
						img.src = properties.coverpath;
					}
					img.width = properties.coverwidth;
					img.height = properties.coverheight;
					img.addEventListener('click', htmlEventListenerH360);
				} else {
					var iframe = document.createElement('iframe');
					iframe.id = properties.id+'iframe';
					iframe.className = 'iframeCSS';
					iframe.src = properties.link;
					iframe.style.position = 'absolute';
					//iframe.style.width = properties.width+'%';
					//iframe.style.height = properties.height+'%';
					iframe.style.top = 0;
					iframe.style.left = 0;
					boxdiv.appendChild(iframe);
					var actiondiv = document.createElement('div');
					actiondiv.style.display = 'block';
					actiondiv.style.position = 'absolute';
					actiondiv.style.width = '99%';
					actiondiv.style.height = '99%';
					actiondiv.id = properties.id;
					actiondiv.itemid = properties.id;
					actiondiv.properties = properties;
					actiondiv.addEventListener('click', htmlEventListenerH360);
					boxdiv.appendChild(actiondiv);
				}
			}else{
				boxdiv = document.getElementById(properties.id);
			}

			if (properties.vo.ontopoptionshor === 'left' && properties.vo.ontopoptionsver === 'top') {
				boxdiv.className = imageEngineClassNameFromProperties(properties);
				boxdiv.style.marginLeft = '0px';
				boxdiv.style.marginTop = '0px';
			} else if (properties.vo.ontopoptionshor === 'right' && properties.vo.ontopoptionsver === 'top') {
				boxdiv.className = imageEngineClassNameFromProperties(properties);
				boxdiv.style.marginLeft = '0px';
				boxdiv.style.marginTop = '0px';
			} else if (properties.vo.ontopoptionshor === 'center' && properties.vo.ontopoptionsver === 'top') {
				boxdiv.className = imageEngineClassNameFromProperties(properties);
				boxdiv.style.marginLeft = '-'+(properties.width/2)+'px';
				boxdiv.style.marginTop = '0px';
			} else if (properties.vo.ontopoptionshor === 'left' && properties.vo.ontopoptionsver === 'bottom') {
				boxdiv.className = imageEngineClassNameFromProperties(properties);
				boxdiv.style.marginLeft = '0px';
				boxdiv.style.marginTop = '0px';
			} else if (properties.vo.ontopoptionshor === 'right' && properties.vo.ontopoptionsver === 'bottom') {
				boxdiv.className = imageEngineClassNameFromProperties(properties);
				boxdiv.style.marginLeft = '0px';
				boxdiv.style.marginTop = '0px';
			} else if (properties.vo.ontopoptionshor === 'center' && properties.vo.ontopoptionsver === 'bottom') {
				boxdiv.className = imageEngineClassNameFromProperties(properties);
				boxdiv.style.marginLeft = '-'+(properties.width/2)+'px';
				boxdiv.style.marginTop = '0px';
			} else if (properties.vo.ontopoptionshor === 'left' && properties.vo.ontopoptionsver === 'middle') {
				boxdiv.className = imageEngineClassNameFromProperties(properties);
				boxdiv.style.marginLeft = '0px';
				boxdiv.style.marginTop = '-'+(properties.height/2)+'px';
			} else if (properties.vo.ontopoptionshor === 'right' && properties.vo.ontopoptionsver === 'middle') {
				boxdiv.className = imageEngineClassNameFromProperties(properties);
				boxdiv.style.marginLeft = '0px';
				boxdiv.style.marginTop = '-'+(properties.height/2)+'px';
			} else if (properties.vo.ontopoptionshor === 'center' && properties.vo.ontopoptionsver === 'middle') {
				boxdiv.className = imageEngineClassNameFromProperties(properties);
				boxdiv.style.marginLeft = '-'+(properties.width/2)+'px';
				boxdiv.style.marginTop = '-'+(properties.height/2)+'px';
			}
			return boxdiv.className;
		}
	}
}


function htmlpageBeahaviourOnTopHideFromProperties(properties) {
	//It's just the overlay of html components overlay out of the scene
	//you must verify if the img is already on the scene
	var element = document.getElementById(properties.id);
	if (element) {
		element.parentNode.removeChild(element);
	}
	var element2 = document.getElementById(properties.id + 'boxiframe');
	if (element2) {
		element2.parentNode.removeChild(element2);
	}
}
