function textBeahaviourOnTopFromProperties(properties, data){
	if (properties.vo) {
		if (properties.vo.ontop) {
			if (!document.getElementById(properties.id + 'overlay')) { //first insert
				var textdiv = document.createElement('div');
				textdiv.classList.add('divText');
				textdiv.style.display = 'block';
				textdiv.id = properties.id + 'overlay';
				textdiv.style.position = 'absolute';
				textdiv.addEventListener('click', eventListenerH360);
				var textcontainer = document.getElementById('container');
				textcontainer.appendChild(textdiv);
				textdiv.style.backgroundColor = properties.background;
				textdiv.style.color = properties.color;
				textdiv.style.fontSize = properties.fontsize + 'px';
				textdiv.innerHTML = properties.text;
				textdiv.properties = properties;
				textdiv.data=JSON.stringify(data);
				textdiv.style.width = properties.width+'px';
				textdiv.style.height = properties.height+'px';

				if (properties.vo.ontopoptionshor === 'left' && properties.vo.ontopoptionsver === 'top') {
					textdiv.classList.add(imageEngineClassNameFromProperties(properties));
					textdiv.style.marginLeft = '0px';
					textdiv.style.marginTop = '0px';
				} else if (properties.vo.ontopoptionshor === 'right' && properties.vo.ontopoptionsver === 'top') {
					textdiv.classList.add(imageEngineClassNameFromProperties(properties));
					textdiv.style.marginLeft = '0px';
					textdiv.style.marginTop = '0px';
				} else if (properties.vo.ontopoptionshor === 'center' && properties.vo.ontopoptionsver === 'top') {
					textdiv.classList.add(imageEngineClassNameFromProperties(properties));
					textdiv.style.marginLeft = '-'+(properties.width/2)+'px';
					textdiv.style.marginTop = '0px';
				} else if (properties.vo.ontopoptionshor === 'left' && properties.vo.ontopoptionsver === 'bottom') {
					textdiv.classList.add(imageEngineClassNameFromProperties(properties));
					textdiv.style.marginLeft = '0px';
					textdiv.style.marginTop = '0px';
				} else if (properties.vo.ontopoptionshor === 'right' && properties.vo.ontopoptionsver === 'bottom') {
					textdiv.classList.add(imageEngineClassNameFromProperties(properties));
					textdiv.style.marginLeft = '0px';
					textdiv.style.marginTop = '0px';
				} else if (properties.vo.ontopoptionshor === 'center' && properties.vo.ontopoptionsver === 'bottom') {
					textdiv.classList.add(imageEngineClassNameFromProperties(properties));
					textdiv.style.marginLeft = '-'+(properties.width/2)+'px';
					textdiv.style.marginTop = '0px';
				} else if (properties.vo.ontopoptionshor === 'left' && properties.vo.ontopoptionsver === 'middle') {
					textdiv.classList.add(imageEngineClassNameFromProperties(properties));
					textdiv.style.marginLeft = '0px';
					textdiv.style.marginTop = '-'+(properties.height/2)+'px';
				} else if (properties.vo.ontopoptionshor === 'right' && properties.vo.ontopoptionsver === 'middle') {
					textdiv.classList.add(imageEngineClassNameFromProperties(properties));
					textdiv.style.marginLeft = '0px';
					textdiv.style.marginTop = '-'+(properties.height/2)+'px';
				} else if (properties.vo.ontopoptionshor === 'center' && properties.vo.ontopoptionsver === 'middle') {
					textdiv.classList.add(imageEngineClassNameFromProperties(properties));
					textdiv.style.marginLeft = '-'+(properties.width/2)+'px';
					textdiv.style.marginTop = '-'+(properties.height/2)+'px';
				}
				if(properties.vo){
		 			if(properties.vo.onblink){
		 				switch(properties.vo.onblinkduration) {
		 					case 'fast':
		 						textdiv.classList.add('imgblinkfast');
		 						break;
		 					case 'slow':
		 						textdiv.classList.add('imgblinkslow');
		 						break;
		 					default://Medium
		 						textdiv.classList.add('imgblinkmedium');
		 				}
		 			}
		 		}
			}
		}
	}
}



function textBeahaviourOnTopHideFromProperties(properties){
	//It's just the overlay of html components overlay out of the scene
	//you must verify if the img is already on the scene
	var element = document.getElementById(properties.id + 'overlay');
	if (element) {
		element.parentNode.removeChild(element);
	}
}
