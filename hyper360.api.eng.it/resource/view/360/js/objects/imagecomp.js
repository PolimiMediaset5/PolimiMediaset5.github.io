/*
* id must be equals to cssObject name
 */
function createCssObjectSceneImage (properties, data) {
    var img = document.createElement('img');
    if(properties.coverpath){
		if(properties.coverpath.length > 0){
      img.src = properties.coverpath;
      /*img.addEventListener("load", function(){
        alert( this.naturalWidth +' '+ this.naturalHeight );
      });*/
		}else{
			img.src = domain+'/resources/video/assets/window.png';
		}
    }else{
      img.src = domain+'/resources/video/assets/window.png';
    }
    img.properties = properties;
	  img.data = data;
    //img.src = domain+'/resources/video/assets/marker.png';
    img.width = properties.coverwidth;
    img.height = properties.coverheight;
    img.style.objectFit='contain';
    img.style.display = 'block';
    img.id = properties.id;
    img.addEventListener('click', htmlEventListenerH360);
    var att = document.createAttribute("data-long-press-delay");
    att.value = getDelayLongClick();
    img.setAttributeNode(att);
    var cssObject = new THREE.CSS3DObject(img);
    return [cssObject, img];
}

function updateCssImageObjectStyle (div, properties) {
  //image
  div.style.display = 'block';
  div.style.width = properties.coverwidth + 'px';
  div.style.height = properties.coverheight + 'px';
  div.src = properties.coverpath;
}

function useCreateCssObjectSceneImage (properties , data) {
  var img = document.createElement('img')
  img.src = properties.coverpath;
  img.properties = properties;

  //img.src = domain+'/resources/video/assets/marker.png';
  img.width = properties.coverwidth;
  img.height = properties.coverheight;
  // img.myprop=data;
  img.data=JSON.stringify(data);

  img.style.objectFit='contain';
  img.style.display = 'block';
  img.id = properties.id;
  img.addEventListener('click', eventListenerH360);

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

	if(data){
    // console.log(data.alpha)
    if (data.recomWeight){
      img.style.opacity= getAlphaValue(1,data.recomWeight);
    }
    //gestione pesi commentata xke è stato deciso che il peso ha un solo effetto sull'immagine
    //modificare la sua opacity come implementato sopra
	    // if(data.recomWeight){
	 	  //  switch(getPropertyFromWeight(data.recomWeight > 1 ? 1 : data.recomWeight , data.category)){
	 	  //  case 'notvisible':
	 		//    console.log('notvisible');
	 		//    break;
	 	  //  case 'bigger':
			//    img.width = properties.coverwidth*2;
			//    img.height = properties.coverheight*2;
	 		//    console.log('bigger');
	 		//    break;
	 	  //  case 'biggerblink':
      //  //commentato xke ora non deve piu blink
			//    // img.width = properties.coverwidth*2;
			//    // img.height = properties.coverheight*2;
			//    // img.className='imgblinkmedium';
	 		//    // console.log('biggerblink');
	 		//    break;
	 	  //  default:
	 		//    break;
	 	  //  }
	    // }
	}

  var cssObject = new THREE.CSS3DObject(img)
  return [cssObject, img];
}
