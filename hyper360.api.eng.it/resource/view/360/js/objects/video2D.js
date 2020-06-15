/*
 * You must use it in config mode
 */
function makeVideoPlan2DGeneric(sizew, sizeh, pathimage) {
  var geometry = new THREE.PlaneGeometry(sizew, sizeh, 100);
  geometry.verticesNeedUpdate = true;
  geometry.normalsNeedUpdate = true;
  var textureLoader = new THREE.TextureLoader();
  if (pathimage) {
    var texturePng = textureLoader.load(
      domain + "/resources/video/assets/video2d.png"
    ); //, function(texture){}
  } else {
    var texturePng = textureLoader.load(pathimage); //, function(texture){}
  }
  var material = new THREE.MeshBasicMaterial({
    map: texturePng,
    transparent: true
  });
  var videoPlan = new THREE.Mesh(geometry, material);
  return videoPlan;
}

function makeTextureWithImagePath(imagepath) {
  var textureLoader = new THREE.TextureLoader();
  var texturePng;
  if (imagepath) {
    texturePng = textureLoader.load(imagepath);
  } else {
    texturePng = textureLoader.load(
      domain + "/resources/video/assets/video2d.png"
    );
  }
  var material = new THREE.MeshBasicMaterial({
    map: texturePng,
    transparent: true
  });
  return material;
}

function makeGeometryWithWidth(sizew, sizeh) {
  var geometry = new THREE.PlaneGeometry(sizew, sizeh, 100);
  geometry.verticesNeedUpdate = true;
  geometry.normalsNeedUpdate = true;
  return geometry;
}

/*
 *  You must use it in player mode
 * index 0 = material
 * index 1 = video refer
 */
function makeTextureVideo2d(properties) {
  var video = document.createElement("video");

  video.loop = properties.loop;
  //video.muted = properties.autoplay;
  video.src = properties.pathresource;
  video.crossOrigin = "anonymous";
  video.setAttribute("controls", "controls");
  video.pause();
  video.autoplay = properties.autoplay;
  video.stopback = properties.stopback;

  var texture = new THREE.VideoTexture(video);
  texture.minFilter = THREE.LinearFilter;
  texture.format = THREE.RGBFormat;
  var material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true
  });
  return [material, video];
}

function makeMediaControls(controlsWidth, xvert, yvert) {
  /*
   * Video2d command
   */
  //var comButtonH=comH/4;
  var comButtonW = controlsWidth / 10;
  var comButtonH = controlsWidth / 10;

  var textureLoader = new THREE.TextureLoader();
  var firstButton = new THREE.PlaneGeometry(comButtonW, comButtonH);
  var textureFirstButton = textureLoader.load(
    domain + "/resources/video/assets/play-3-64.png"
  ); //, function(texture){}
  var materialFirstButton = new THREE.MeshBasicMaterial({
    map: textureFirstButton,
    transparent: true
  });
  var buttonFirstPlan = new THREE.Mesh(firstButton, materialFirstButton);
  buttonFirstPlan.position.set(
    xvert + comButtonW / 2 + controlsWidth / 3,
    yvert - comButtonH / 2,
    1
  );

  var secondButton = new THREE.PlaneGeometry(comButtonW, comButtonH);
  var textureSecondButton = textureLoader.load(
    domain + "/resources/video/assets/pause-64.png"
  ); //, function(texture){}
  var materialSecondButton = new THREE.MeshBasicMaterial({
    map: textureSecondButton,
    transparent: true
  });
  var buttonSecondPlan = new THREE.Mesh(secondButton, materialSecondButton);
  buttonSecondPlan.position.set(
    buttonFirstPlan.position.x + comButtonW,
    buttonFirstPlan.position.y,
    1
  );

  var thirdButton = new THREE.PlaneGeometry(comButtonW, comButtonH);
  var textureThirdButton = textureLoader.load(
    domain + "/resources/video/assets/close-window-64.png"
  ); //, function(texture){}
  var materialThirdButton = new THREE.MeshBasicMaterial({
    map: textureThirdButton,
    transparent: true
  });
  var buttonThirdPlan = new THREE.Mesh(thirdButton, materialThirdButton);
  buttonThirdPlan.position.set(
    buttonSecondPlan.position.x + comButtonW,
    buttonSecondPlan.position.y,
    1
  );

  var mediaCommandGroup = new THREE.Group();
  mediaCommandGroup.add(buttonFirstPlan);
  mediaCommandGroup.add(buttonSecondPlan);
  mediaCommandGroup.add(buttonThirdPlan);

  return mediaCommandGroup;
}

/*
 * You must use it in player mode
 */
function makeVideoPlan2D(resourcepath) {
  var geometry = new THREE.PlaneGeometry(sizew, sizeh, 100);
  var video = document.createElement("video");
  /*video.onloadedmetadata = function () {
    alert("Meta data for video loaded:");
  };*/
  video.loop = true;
  video.muted = false;
  video.src = resourcepath;
  video.crossOrigin = "anonymous";
  video.setAttribute("webkit-playsinline", "webkit-playsinline");
  video.setAttribute("id", "video");
  video.play();
  var texture = new THREE.VideoTexture(video);
  texture.minFilter = THREE.LinearFilter;
  texture.format = THREE.RGBFormat;
  var material = new THREE.MeshBasicMaterial({
    map: texture,
    color: 0xffff00,
    transparent: true
  });
  // material.wireframe = true;
  var videoPlan = new THREE.Mesh(geometry, material);
  return videoPlan;
}

/** Michele Fuschillo
 * Make video 2d in HTML mode - EDIT MODE - START
 *
 * THE BORDER (FOCUS / MOVE) REFERS TO BOXVIDEO AND NOT TO THE COVER IMAGE
 */
function makeVideoCssObjEdit(properties) {
  /**
   * check snippet mentor
   */
  if (properties.mentor === true && properties.mentorsnippet === false) {
    var mentorTemp = createVideoSphereChromakey(videoSphereRadius,properties.pathresource,'#00d900');
    //var mentorTemp = createVideoSphereChromakey(videoSphereRadius,'https://rti-hyper360.s3.eu-west-3.amazonaws.com/mentor/mentor.mp4','#00d900');
    //scene.add(videoSphereMentor);
    //videoSphereMentorMaterial.startVideo();
    if(mentorTemp.length >= 1){
      return [mentorTemp[0],mentorTemp[1]];
    }else{
      return [];
    }
  } else {
    var videoOrCover;
    var boxvideo2d = document.createElement("div");
    boxvideo2d.style.display = "block";
    boxvideo2d.style.position = "relative";
    boxvideo2d.id = properties.id + "_boxvideo2d";
    if (properties.cover === true) {
      videoOrCover = document.createElement("img");
      videoOrCover.id = properties.id + "_video2dcover";
      videoOrCover.itemid = properties.id;
      videoOrCover.style.objectFit = "contain";
      videoOrCover.style.display = "block";
      videoOrCover.style.top = 0;
      videoOrCover.style.left = 0;
      videoOrCover.src = properties.coverpath;
      videoOrCover.style.width = properties.coverwidth + "px";
      videoOrCover.style.height = properties.coverheight + "px";
      boxvideo2d.style.width = properties.coverwidth + "px";
      boxvideo2d.style.height = properties.coverheight + "px";
    } else {
      videoOrCover = document.createElement("img");
      videoOrCover.id = properties.id;
      //videoOrCover.style.objectFit='contain';
      videoOrCover.style.display = "block";
      videoOrCover.style.top = 0;
      videoOrCover.style.left = 0;
      videoOrCover.src = (properties.mentor === true ? domain + "/resources/video/assets/videoMentor.png" : domain + "/resources/video/assets/video2d.png");
      videoOrCover.style.width = properties.width + "px";
      videoOrCover.style.height = properties.height + "px";
      boxvideo2d.style.width = properties.width + "px";
      boxvideo2d.style.height = properties.height + "px";

      /*videoOrCover = document.createElement('video');
			videoOrCover.style.position = 'absolute';
			videoOrCover.style.backgroud='black';
			videoOrCover.id = properties.id;
			videoOrCover.loop = properties.loop;
			videoOrCover.width=properties.width;
			videoOrCover.height=properties.height;
			videoOrCover.src = properties.pathresource;
			videoOrCover.crossOrigin = 'anonymous';
			videoOrCover.setAttribute('controls','controls');
			videoOrCover.pause();
			videoOrCover.autoplay = properties.autoplay;
			boxvideo2d.style.width = properties.width + 'px';
			boxvideo2d.style.height = properties.height + 'px';*/
    }
    boxvideo2d.appendChild(videoOrCover);
    let cssObject = new THREE.CSS3DObject(boxvideo2d);
    videoOrCover.addEventListener("click", htmlEventListenerH360);
    var att = document.createAttribute("data-long-press-delay");
    att.value = getDelayLongClick();
    videoOrCover.setAttributeNode(att);
    return [cssObject, videoOrCover];
  }
}

/*
 * tagfirst = generic tag (video container)
 * tagsecond = video tag
 */
function updateVideoCssObjEdit(properties) {
  /**
   * check snippet mentor
   */
  if (properties.mentor === true && properties.mentorsnippet === false) {
      return;
  }else{
    var contvideo = document.getElementById(properties.id + "_boxvideo2d");
    if (contvideo) {
	  if (properties.cover === true) {
        var cover2dvideo = document.getElementById(
		  properties.id + "_video2dcover"
        );
        //console.log(cssRenderer.domElement.div);
        var videocheck = document.getElementById(properties.id);
        if (videocheck) {
		  videocheck.parentNode.removeChild(videocheck);
        }
        if (!cover2dvideo) {
		  cover2dvideo = document.createElement("img");
		  cover2dvideo.id = properties.id + "_video2dcover";
		  cover2dvideo.itemid = properties.id;
		  cover2dvideo.style.objectFit = "contain";
		  cover2dvideo.style.display = "block";
		  cover2dvideo.addEventListener("click", htmlEventListenerH360);
		  contvideo.appendChild(cover2dvideo);
        }
        cover2dvideo.src = properties.coverpath;
        cover2dvideo.style.width = properties.coverwidth + "px";
        cover2dvideo.style.height = properties.coverheight + "px";
        contvideo.style.width = properties.coverwidth + "px";
        contvideo.style.height = properties.coverheight + "px";
	  } else {
        var coverimg = document.getElementById(properties.id + "_video2dcover");
        if (coverimg) {
		  coverimg.parentNode.removeChild(coverimg);
        }
        var videoinbox = document.getElementById(properties.id);
        if (!videoinbox) {
		  videoinbox = document.createElement("img");
		  videoinbox.id = properties.id;
		  //videoinbox.style.objectFit='contain';
		  videoinbox.style.display = "block";
		  videoinbox.style.top = 0;
		  videoinbox.style.left = 0;
		  videoinbox.src = domain + "/resources/video/assets/video2d.png";
		  contvideo.appendChild(videoinbox);
		  /*
				  videoinbox  = document.createElement('video');
				  videoinbox.addEventListener('click', htmlEventListenerH360);
				  videoinbox.style.position = 'absolute';
				  videoinbox.id = properties.id;
				  videoinbox.crossOrigin = 'anonymous';
				  videoinbox.setAttribute('controls','controls');
				  videoinbox.pause();
				  contvideo.appendChild(videoinbox);*/
        }
        videoinbox.style.width = properties.width + "px";
        videoinbox.style.height = properties.height + "px";
        contvideo.style.width = properties.width + "px";
        contvideo.style.height = properties.height + "px";
  
        /*videoinbox.loop = properties.loop;
			  videoinbox.width=properties.width;
			  videoinbox.height=properties.height;
			  videoinbox.src = properties.pathresource;
			  videoinbox.autoplay = properties.autoplay;
			  contvideo.style.width = properties.width + 'px';
			  contvideo.style.height = properties.height + 'px';*/
	  }
    }
  }		
}

/** Michele Fuschillo
 * Make video 2d in HTML mode - EDIT MODE - END
 */

/** Michele Fuschillo
 * Make video 2d in HTML mode - USE MODE - START
 */

function makeVideoCssObj(properties, closebutton) {
  let boxvideo2d = document.createElement("div");
  boxvideo2d.style.display = "block";
  boxvideo2d.id = properties.id + "video2dcssobj";
  boxvideo2d.style.width = properties.width + "px";
  boxvideo2d.style.height = properties.height + "px";
  let video2d = document.createElement("video");
  video2d.style.position = "absolute";
  video2d.itemid = properties.id;
  video2d.loop = properties.loop;
  video2d.width = properties.width;
  video2d.height = properties.height;
  video2d.src = properties.pathresource;
  video2d.controlsList = "nodownload";
  video2d.crossOrigin = "anonymous";
  video2d.setAttribute("controls", "controls");
  video2d.pause();

  var showhotspot = true; //THE OBJECT WILL BE VISIBLE IN THE SCENE - FOR THE TARGET OBJECT
  if (typeof properties.vo !== "undefined") {
    if (typeof properties.vo.showhotspot !== "undefined") {
      showhotspot = properties.vo.showhotspot;
    }
  }
  /*if (showhotspot === true) {
    video2d.autoplay = properties.autoplay;
  }*/
  boxvideo2d.appendChild(video2d);
  /*if (properties.autoplay === true && showhotspot === true) {
    video2d.play();
  }*/

  if (closebutton) {
    var button = document.createElement("button");
    button.id = properties.id;
    button.data =
      '{"category":"video2d", "action":"close", "properties":{"coveraction":"close"}}';
    button.properties = { coveraction: "close" };
    button.innerHTML = "Close";
    button.style.position = "relative";
    button.style.left = "95%";
    button.addEventListener("click", htmlEventListenerH360);
    boxvideo2d.appendChild(button);
  }

  let cssObject = new THREE.CSS3DObject(boxvideo2d);
  return [cssObject, video2d];
}

function makeVideoCoverCssObj(properties, data) {
  var img = document.createElement("img");
  img.src = properties.coverpath;
  img.properties = properties;

  //img.src = domain+'/resources/video/assets/marker.png';
  img.style.width = properties.coverwidth + "px";
  img.style.height = properties.coverheight + "px";
  //img.myprop=data;
  img.data = JSON.stringify(data);

  img.style.objectFit = "contain";
  img.style.display = "block";
  img.id = properties.id;
  img.addEventListener("click", htmlEventListenerH360);

  if (properties.vo) {
    if (properties.vo.onblink) {
      switch (properties.vo.onblinkduration) {
        case "fast":
          img.className = "imgblinkfast";
          break;
        case "slow":
          img.className = "imgblinkslow";
          break;
        default:
          //Medium
          img.className = "imgblinkmedium";
      }
    }
  }
  if (data) {
    if (data.recomWeight) {
      img.style.opacity = getAlphaValue(1, data.recomWeight);
      // switch(getPropertyFromWeight(data.recomWeight > 1 ? 1 : data.recomWeight , data.category)){
      // case 'notvisible':
      //   console.log('notvisible');
      //   break;
      // case 'bigger':
      //   img.width = properties.coverwidth*2;
      //   img.height = properties.coverheight*2;
      //   console.log('bigger');
      //   break;
      // case 'biggerblink':
      //   img.width = properties.coverwidth*2;
      //   img.height = properties.coverheight*2;
      //   img.className='imgblinkmedium';
      //   console.log('biggerblink');
      //   break;
      // default:
      //   break;
      // }
    }
  }
  var cssObject = new THREE.CSS3DObject(img);
  return [cssObject, img];
}

/**
 * Make video 2d in HTML mode - USE MODE - END
 */
