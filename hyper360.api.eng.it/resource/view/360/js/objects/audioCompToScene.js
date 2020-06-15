/*
* You must use it in config mode - LEARNING
 */
function learningCreateAudioObjectScene (properties) {
  var img = document.createElement('img')
  // img.src = properties.coverpath;

  img.src = domain+'/resources/video/assets/audio.png';
  img.width = properties.width-20;
  img.height = properties.height-20;
  img.id = properties.id;
  img.style.opacity = properties.vo.valuerange;
	//console.log('==========>>>>',properties)

  var att = document.createAttribute("data-long-press-delay");
  att.value = getDelayLongClick();
  img.setAttributeNode(att);
  img.addEventListener('click', htmlEventListenerH360);
  
  // var div = document.createElement('div');
  // div.className = 'audioDivText';
  // div.style.position = 'absolute';
  // div.style.width = properties.width+'px';
  // div.style.height = properties.height+'px';
  // div.style.backgroundColor = properties.background;
  // div.style.color = properties.color
  // div.addEventListener('dblclick', htmlEventListenerH360);
  // div.id = properties.id;
   // div.appendChild(img);
  var cssObject = new THREE.CSS3DObject(img)
  return [cssObject, img]
}

function learningUpadateAudioObjectScene (div, properties) {
  div.style.width = properties.width + 'px';
  div.style.height = properties.height + 'px';
	div.style.opacity = properties.vo.valuerange;
}

/*
* You must use it in play mode - USE
 */
function useCreateAudioObjectScene(properties,camera, data , callback) {

	if (typeof properties.positional !== 'undefined') {
		if(properties.positional.active === true){
			return useCreatePositionalAudioObjectScene(properties,camera, data , callback);
		}
	}
	var div = document.createElement('div');
	div.className = 'audioDivText';
	div.style.position = 'absolute';
	div.style.width = properties.width + 'px';
	div.style.height = properties.height + 'px';
	div.style.backgroundColor = properties.background;
	div.style.color = properties.color;
  console.log(data.recomWeight)
  console.log(properties.vo.valuerange)
  if (data){
    if (data.recomWeight){
    div.style.opacity=  getAlphaValue(properties.vo.valuerange,data.recomWeight)
      // var alpha = data.recomWeight *properties.vo.valuerange ;
      // if (alpha>= 0.35){
      // div.style.opacity=alpha;
      // }else {
      //   div.style.opacity=0.35;
      // }
    }else{
      div.style.opacity = properties.vo.valuerange;
    }
  }else{
  div.style.opacity = properties.vo.valuerange;
  }


	div.id = properties.id;

	var button = document.createElement('button');
	button.disabled=true;
	/*
	* AUDIO
	* https://threejs.org/docs/#api/en/audio/Audio
	*/
	// create an AudioListener and add it to the camera
	var audioListener = new THREE.AudioListener();
	camera.add(audioListener);
	// create a global audio source
  var audioSource = new THREE.Audio(audioListener);
	//http://www.developphp.com/lib/JavaScript/Audio
  var mediaElement = new Audio();
	mediaElement.crossOrigin='anonymous';
// console.log(mediaElement);
	mediaElement.loop=properties.loop; //Gestico loop audio
	//mediaElement.autoplay=properties.autoplay; //Gestico autoplay

	mediaElement.src = properties.audioPath;
	audioSource.setMediaElementSource(mediaElement);

	mediaElement.addEventListener("canplay",function () {
		button.mediaElement = mediaElement;
		button.disabled=false;
	});



	/*
	* Play/Pause
	* */
	button.className = 'big ui inverted icon primary button fluid circular';
	button.id = 'audio';
	button.properties = properties;
	button.data=JSON.stringify(data);
	button.myIndexArray=0;
	button.style.width = properties.width + 'px';
	button.style.height = properties.height + 'px';
	var icon = document.createElement('i');
	icon.className = 'big play circle fitted icon';
	mediaElement.addEventListener("ended",function () {
		icon.className = 'big play circle fitted icon';
	});
	icon.id = 'playiconaudio';
	button.appendChild(icon);
	button.addEventListener('click', function () {callback(this)});
	div.appendChild(button);
	//div.style.textAlign = properties.textalign;
	var cssObject = new THREE.CSS3DObject(div);
	return [cssObject, div, mediaElement, icon,button];
}

function useCreatePositionalAudioObjectScene (properties,camera, data , callback) {

  var div = document.createElement('div');
  div.className = 'audioDivText';
  div.style.position = 'absolute';
  div.style.width = properties.width + 'px';
  div.style.height = properties.height + 'px';
  div.style.backgroundColor = properties.background;
  div.style.color = properties.color;
	div.style.opacity = properties.vo.valuerange;
  div.id = properties.id;

  var button = document.createElement('button');
  button.disabled=true;
  /*
   * AUDIO
   * https://threejs.org/docs/#api/en/audio/Audio
     */
  // create an AudioListener and add it to the camera
   var audioListener = new THREE.AudioListener();
   camera.add(audioListener);

   // create the PositionalAudio object (passing in the listener)
   var sound = new THREE.PositionalAudio( audioListener );
   //sound.autoplay=properties.autoplay;
   //sound.setDirectionalCone(1,1,0); //cono strettissimo, solo se guardi di fronte si sente
   //sound.setDirectionalCone(90,180,0); //funziona bene
   //sound.setDirectionalCone(0.25,0.5,0); //non si sente
   //sound.setDirectionalCone(90,180,1);

   //coneInnerAngle : Float, coneOuterAngle : Float, coneOuterGain : Float

  var audioLoader = new THREE.AudioLoader();
  audioLoader.load(properties.audioPath, function( buffer ) {
    sound.setBuffer( buffer );
    sound.setRefDistance( 800 );
	sound.setVolume( 10 );
    sound.setLoop(properties.loop);

    //sound.play();
	var panner = sound.getOutput();
	panner.coneInnerAngle = properties.positional.coneInnerAngle;
	panner.coneOuterAngle = properties.positional.coneOuterAngle;
	panner.coneOuterGain = properties.positional.coneOuterGain;

	/*var panner = sound.getOutput();
		panner.coneInnerAngle = 90;
		panner.coneOuterAngle = 180;
		panner.coneOuterGain = 0.9;*/

    button.mediaElement = sound;
  	button.disabled=false;
	if(properties.autoplay === true){
		icon.className = 'big pause circle fitted icon';
		//sound.autoplay=true;
		//sound.play();
	}else{
		icon.className = 'big play circle fitted icon';
	}
  },// onProgress callback
	function ( xhr ) {
		if(xhr.loaded === xhr.total){
			console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
		}
	},

	// onError callback
	function ( err ) {
		console.log( 'An error happened' );
	});

  /*
  * Play/Pause
  * */
  button.className = 'big ui inverted icon primary button fluid circular';
  button.id = 'audio';
  button.properties = properties;
  button.data=JSON.stringify(data);
  button.myIndexArray=0;
  button.style.width = properties.width + 'px';
  button.style.height = properties.height + 'px';
  var icon = document.createElement('i');
  icon.className = 'big play circle fitted icon';
  //mediaElement.addEventListener("ended",function () {
 	// icon.className = 'big play circle fitted icon';
  //});
  icon.id = 'playiconaudio';
  button.appendChild(icon);
  button.addEventListener('click', function () {callback(this)});
  div.appendChild(button);
  //div.style.textAlign = properties.textalign;
  var cssObject = new THREE.CSS3DObject(div);
  // finally add the sound to the mesh
  cssObject.add(sound);
  return [cssObject, div, sound, icon,button];
}
