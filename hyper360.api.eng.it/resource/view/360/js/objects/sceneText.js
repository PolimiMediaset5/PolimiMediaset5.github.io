function createSceneText (text, font, color, x, y, z, rx, ry, rz, s) {
	var textGeometry = new THREE.TextGeometry(text || 'text', {
		font: font,
		size: 35,
		height: 1,
		curveSegments: 12,
		bevelThickness: 1,
		bevelSize: 1,
		bevelEnabled: false
	})

	var textMaterial = new THREE.MeshBasicMaterial({color: color, side: THREE.FrontSide})
	var textMesh = new THREE.Mesh(textGeometry, textMaterial)
	textMesh.userData.kind = 'text'
	textMesh.position.set(x, y, z)
	textMesh.rotation.set(rx, ry, rz)
	textMesh.scale.set(s, s, s)

	return textMesh
}

/*
* id must be equals to cssObject name
*/
function createCssObjectSceneText (properties) {
	if (properties.iframe) {
		var boxdiv = document.createElement('div');
		boxdiv.className = 'boxCSS'
		boxdiv.style.position = 'absolute'
		boxdiv.style.width = properties.width + 'px'
		boxdiv.style.height = properties.height + 'px'
		boxdiv.id = properties.id;
		//boxdiv.addEventListener('click', htmlEventListenerH360);

		var iframe = document.createElement('iframe')
		iframe.id = properties.id;
		iframe.className = 'iframeCSS'
		iframe.src = properties.link
		iframe.style.position = 'absolute'
		//iframe.style.width = properties.width+'%';
		//iframe.style.height = properties.height+'%';
		iframe.style.top = 0
		iframe.style.left = 0
		boxdiv.appendChild(iframe)

		var img = document.createElement('img')
		img.className = 'center'
		//cover.src = properties.coverurl; //http://localhost:3000/resource/video/360/cover/berlinale.jpg
		//img.src = 'http://localhost:3000/resource/video/360/cover/berlinale.jpg'
		if (properties.covertype === 'marker') {
			img.src = domain+'/resources/video/assets/marker.png'
		} else {
			img.src = properties.coverpath;
		}
		img.style.objectFit='contain';
		img.style.display = 'block';
	    var att = document.createAttribute("data-long-press-delay");
	    att.value = getDelayLongClick();
	    img.setAttributeNode(att);
		img.width = properties.coverwidth;
		img.height = properties.coverheight;
		img.id = properties.id;
		boxdiv.appendChild(img)

		if (properties.cover) {
			img.style.display = 'block'
			img.addEventListener('click', htmlEventListenerH360);
			
		} else {
			img.style.display = 'none'
		}
		var actiondiv = document.createElement('div')
		actiondiv.style.position = 'absolute'
		actiondiv.style.width = '99%'
		actiondiv.style.height = '99%'
		actiondiv.id = properties.id;
		actiondiv.addEventListener('click', htmlEventListenerH360);
	    var att = document.createAttribute("data-long-press-delay");
	    att.value = getDelayLongClick();
	    actiondiv.setAttributeNode(att);
		boxdiv.appendChild(actiondiv)

		//div.style.textAlign = properties.textalign;
		var cssObject = new THREE.CSS3DObject(boxdiv)
		return [cssObject, [boxdiv, iframe, img, actiondiv]]
	}
	else {
		var div = document.createElement('div');
		div.classList.add('divText');
		div.style.position = 'absolute';
		div.style.width = properties.width + 'px';
		div.style.height = properties.height + 'px';
		div.style.backgroundColor = properties.background;
		//div.style.background-color = rgba(120, 120, 120, 0.50);
		div.style.color = properties.color;
		div.style.fontSize = properties.fontsize + 'px';
		div.innerHTML = properties.text;
		div.addEventListener('click', htmlEventListenerH360);
	    var att = document.createAttribute("data-long-press-delay");
	    att.value = getDelayLongClick();
	    div.setAttributeNode(att);
		div.id = properties.id;
		if(properties.vo){
			if(properties.vo.onblink){
				switch(properties.vo.onblinkduration) {
				case 'fast':
					div.classList.add('imgblinkfast');
					break;
				case 'slow':
					div.classList.add('imgblinkslow');
					break;
				default://Medium
					div.classList.add('imgblinkmedium');
				}
			}
		}
		//div.style.textAlign = properties.textalign;
		var cssObject = new THREE.CSS3DObject(div);
		return [cssObject, div];
	}
	/*cssObject.position.x = position.x;
	cssObject.position.y = position.y;
	cssObject.position.z = position.z;*/

}

function updateCssObjectStyle (div, properties) {
	if (properties.iframe) {
		div[0].style.width = properties.width + 'px'
		div[0].style.height = properties.height + 'px'
		//iframe src
		div[1].src = properties.link

		if (properties.cover) {
			//img (cover)
			div[2].style.display = 'block'
			div[2].style.width = properties.coverwidth + 'px'
			div[2].style.height = properties.coverheight + 'px'
			div[2].covertype = properties.covertype
			if (div[2].src != properties.coverpath) {
				if (properties.covertype === 'marker') {
					div[2].src = domain+'/resources/video/assets/marker.png'
				} else {
					div[2].src = properties.coverpath
				}
			}
		} else {
			div[2].style.display = 'none'
		}
	} else {
		div.className = 'divText'
		div.style.position = 'absolute'
		div.style.width = properties.width + 'px'
		div.style.height = properties.height + 'px'
		div.innerHTML = properties.text
		div.style.backgroundColor = properties.background
		div.style.color = properties.color
		div.style.fontSize = properties.fontsize + 'px'
	}
	//div.style.font-size = properties.fontsize;
	//div.style.text-align: properties.textalign;

	/*cssObject.position.x = position.x;
	cssObject.position.y = position.y;
	cssObject.position.z = position.z;*/
}

/*
* USE MODE //il terzo parametro viene usato solo per i dati del recom
*/
function makingCSSObjectWithHTMLpage (properties, position, weight) {
	if (properties.cover || properties.covertype === 'marker') {
		var img = document.createElement('img')
		//img.className = 'center';
		//cover.src = properties.coverurl; //http://localhost:3000/resource/video/360/cover/berlinale.jpg
		//img.src = 'http://localhost:3000/resource/video/360/cover/berlinale.jpg'
		if (properties.covertype === 'marker') {
			img.src = domain+'/resources/video/assets/marker.png'
		} else {
			img.src = properties.coverpath;
			if (weight){
				console.log("sto cambiando il valore di alpha " + getAlphaValue(1,weight))
				img.style.opacity= getAlphaValue(1,weight);
			}
		}
		img.width = properties.coverwidth;
		img.height = properties.coverheight;
		img.style.display = 'block';
		img.properties = properties;
		img.style.objectFit='contain';
		img.position = position ? position : "";
		img.id = properties.id;
		if(properties.vo){
			if(properties.vo.onblink){
				switch(properties.vo.onblinkduration) {
					case 'fast':
						img.className='imgblinkfast';
						break;
					case 'slow':
						img.className='imgblinkslow';
						break;
					default://Medium
						img.className='imgblinkmedium';
				}
			}
		}
		img.addEventListener('click', htmlEventListenerH360)
		var cssObject = new THREE.CSS3DObject(img)
		return [cssObject, img]
	} else {

		var boxdiv = document.createElement('div')
		boxdiv.style.position = 'absolute';
		boxdiv.style.width = properties.width+'px';
		boxdiv.style.height = properties.height+'px';
		boxdiv.id = properties.id

		var button = document.createElement('button')
		button.id = properties.id;
		button.properties = {coveraction:"close"};
		button.innerHTML = "Close";
		button.style.position = 'relative';
		button.style.left="95%";
		button.addEventListener('click',htmlEventListenerH360);

		var iframe = document.createElement('iframe')
		iframe.id = properties.id
		iframe.src = properties.link
		iframe.style.position = 'absolute'
		iframe.style.top='20px';
		iframe.style.width = '100%';
		iframe.style.height = '90%';
		iframe.style.left = 0
		boxdiv.appendChild(iframe);
		boxdiv.appendChild(button);
		var cssObject = new THREE.CSS3DObject(boxdiv)
		return [cssObject, boxdiv]
	}
}

/*
* id must be equals to cssObject name
*/
function useCreateCssObjectSceneText (properties, data) {
		var div = document.createElement('div');
		div.classList.add('divText');
		div.style.position = 'absolute';
		div.style.width = properties.width + 'px';
		div.style.height = properties.height + 'px';
		div.style.backgroundColor = properties.background;
		//div.style.background-color = rgba(120, 120, 120, 0.50);
		div.style.color = properties.color;
		div.style.fontSize = properties.fontsize + 'px';
		div.innerHTML = properties.text;
		div.data=JSON.stringify(data);
		div.addEventListener('click', eventListenerH360);
		div.properties = properties;
		div.id = properties.id;
		if(properties.vo){
			if(properties.vo.onblink){
				switch(properties.vo.onblinkduration) {
				case 'fast':
					div.classList.add('imgblinkfast');
					break;
				case 'slow':
					div.classList.add('imgblinkslow');
					break;
				default://Medium
					div.classList.add('imgblinkmedium');
				}
			}
		}
		if(data){
		    if(data.recomWeight){
		 	   switch(getPropertyFromWeight(data.recomWeight > 1 ? 1 : data.recomWeight , data.category)){
		 	   case 'notvisible':
		 		   console.log('notvisible');
		 		   break;
		 	   case 'bigger':
				   div.style.width = properties.width*2 + 'px';
				   div.style.height = properties.height*2 + 'px';
		 		   console.log('bigger');
		 		   break;
		 	   case 'biggerblink':
				   div.style.width = properties.width*4 + 'px';
				   div.style.height = properties.height*4 + 'px';
				   // div.classList.add('imgblinkmedium');
		 		   console.log('biggerblink');
		 		   break;
		 	   default:
		 		   break;
		 	   }
		    }
		}

		//div.style.textAlign = properties.textalign;
		var cssObject = new THREE.CSS3DObject(div);
		return [cssObject, div];
}
