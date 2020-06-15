function metadataBeahaviourOnTopFromProperties(properties){
  //It's just the overlay of html components overlay out of the scene
    if(properties.vo.ontop){
      //you must verify if the img is already on the scene
      if(!document.getElementById(properties.id)){
        var imagecontainer = document.getElementById('container');
        var img = document.createElement('img');
        if(properties.coverpath.length>0){
          img.src = properties.coverpath;
        }else{
          img.src = domain+'/resources/video/assets/window.png';
        }
        img.properties = properties;
        img.width = properties.width ? properties.width : properties.coverwidth;
        img.height = properties.height ? properties.height : properties.coverheight;
        img.style.display = 'block';
        img.id = properties.id;
        if (properties.vo.ontopoptionshor === 'left' && properties.vo.ontopoptionsver === 'top') {
          img.className = imageEngineClassNameFromProperties(properties);
          img.style.marginLeft = '0px';
          img.style.marginTop = '0px';
        } else if (properties.vo.ontopoptionshor === 'right' && properties.vo.ontopoptionsver === 'top') {
          img.className = imageEngineClassNameFromProperties(properties);
          img.style.marginLeft = '0px';
          img.style.marginTop = '0px';
        } else if (properties.vo.ontopoptionshor === 'center' && properties.vo.ontopoptionsver === 'top') {
          img.className = imageEngineClassNameFromProperties(properties);
          img.style.marginLeft = '-'+(img.width/2)+'px';
          img.style.marginTop = '0px';
        } else if (properties.vo.ontopoptionshor === 'left' && properties.vo.ontopoptionsver === 'bottom') {
          img.className = imageEngineClassNameFromProperties(properties);
          img.style.marginLeft = '0px';
          img.style.marginTop = '0px';
        } else if (properties.vo.ontopoptionshor === 'right' && properties.vo.ontopoptionsver === 'bottom') {
          img.className = imageEngineClassNameFromProperties(properties);
          img.style.marginLeft = '0px';
          img.style.marginTop = '0px';
        } else if (properties.vo.ontopoptionshor === 'center' && properties.vo.ontopoptionsver === 'bottom') {
          img.className = imageEngineClassNameFromProperties(properties);
          img.style.marginLeft = '-'+(img.width/2)+'px';
          img.style.marginTop = '0px';
        } else if (properties.vo.ontopoptionshor === 'left' && properties.vo.ontopoptionsver === 'middle') {
          img.className = imageEngineClassNameFromProperties(properties);
          img.style.marginLeft = '0px';
          img.style.marginTop = '-'+(img.height/2)+'px';
        } else if (properties.vo.ontopoptionshor === 'right' && properties.vo.ontopoptionsver === 'middle') {
          img.className = imageEngineClassNameFromProperties(properties);
          img.style.marginLeft = '0px';
          img.style.marginTop = '-'+(img.height/2)+'px';
        } else if (properties.vo.ontopoptionshor === 'center' && properties.vo.ontopoptionsver === 'middle') {
          img.className = imageEngineClassNameFromProperties(properties);
          img.style.marginLeft = '-'+(img.width/2)+'px';
          img.style.marginTop = '-'+(img.height/2)+'px';
        }
        img.addEventListener('click', htmlEventListenerH360);
        imagecontainer.appendChild(img);
      }
    }
}



function metadataBeahaviourOnTopHideFromProperties(properties){
  //It's just the overlay of html components overlay out of the scene
  if(properties.vo.ontop){
    //you must verify if the img is already on the scene
    var element = document.getElementById(properties.id);
    if(element){
      element.parentNode.removeChild(element);
    }
  }
}