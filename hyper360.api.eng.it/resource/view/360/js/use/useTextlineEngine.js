function textlineBeahaviourOnTopFromProperties(properties){
	if(!properties)
		return;
	var textdiv; 
	var node;	
	if (!document.getElementById(properties.id + 'overlay')) { //first insert
		textdiv = document.createElement('div');
		textdiv.properties = properties;
		textdiv.classList.add('divTextline');
		textdiv.style.display = 'block';
		textdiv.style.position = 'absolute';
		textdiv.id = properties.id + 'overlay';
		textdiv.itemid = properties.id;
		textdiv.style.fontSize ='20px';
		textdiv.style.textAlign ='center';
		textdiv.addEventListener('click', eventListenerH360);
		textdiv.classList.add(imageEngineClassNameFromProperties(properties));
		node = document.createElement('div');
		node.classList.add('scroll-left');
		node.id = properties.id +'overlaytext';
		node.itemid = properties.id;
		node.properties = properties;
		node.innerHTML = properties.text ? properties.text : '';
		node.addEventListener('click', eventListenerH360);
		textdiv.appendChild(node);
		var textcontainer = document.getElementById('container');
		textcontainer.appendChild(textdiv);
		node.style.setProperty('--colorScrollableText', properties.color);
		textdiv.style.setProperty('--scrollcolorbck', properties.background);

		if(properties.vo.onscrolloptionstxt==='fix'){
			node.style.setProperty('--scrolloptions', 'translateX(0%)');
			node.style.setProperty('--scrollver', 'unset');
			properties.vo.onscrolldirection='unset';
		}else{
			node.style.setProperty('--scrolloptions', 'translateX(100%)');
		}	
	
		if(properties.vo.onscrolldirection==='right'){
			node.style.setProperty('--scrollver', 'scroll-right');
		}else if(properties.vo.onscrolldirection==='left'){
			node.style.setProperty('--scrollver', 'scroll-left');
		}else{
			node.style.setProperty('--scrollver', 'unset');
		}	

		if(properties.vo.onscrollduration==='low'){
			node.style.setProperty('--scrollduration', '20s');
		}else if(properties.vo.onscrollduration==='medium'){
			node.style.setProperty('--scrollduration', '12s');
		}else if(properties.vo.onscrollduration==='fast'){
			node.style.setProperty('--scrollduration', '8s');
		}

		if(properties.vo.onscrolliteration==='oneshoot'){
			node.style.setProperty('--scrolliteration', 1);
		}else{
			node.style.setProperty('--scrolliteration', 'infinite');
		}	

		if(properties.vo.onscrollver==='top'){
			node.style.setProperty('--marginFs', '10px');
		}else{
			var getHeight=window.screen.availHeight;
			var getWidtht=window.screen.availWidth;
			if(getHeight >700){
				textdiv.style.setProperty('--bottomFs', '10%');
			}
			node.style.setProperty('--marginFs', '10px');
		}
	}else{
		textdiv = document.getElementById(properties.id + 'overlay');
		textdiv.style.setProperty('z-index','1');
	}
	return textdiv;
}
	
function textlineBeahaviourOnTopHideFromProperties (properties) {
	var rmtextdiv = document.getElementById(properties.id + 'overlay');
	var rmnode = document.getElementById(properties.id + 'overlaytext');

	if(rmtextdiv) 
	rmtextdiv.parentNode.removeChild(rmtextdiv)

	if(rmnode) 
	rmnode.parentNode.removeChild(rmnode)
}