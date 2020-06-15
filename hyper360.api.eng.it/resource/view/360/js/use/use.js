/**
 * use.js
 *
 */

// *** Global configuration variables ***
var videoSphereRadius = 800; // Main video sphere radius
var videoSphere;
var videoSphereMentor;
var videoSphereMentorMaterial;
var camera, scene, renderer, cssRenderer, cssScene;
var boxobjs = []; //box containing scene objects
var eventTimeline = {}; // Event timeline
var sceneObjects = {}; // Objects on the scene loaded from db, with '_id' as the key
var RwdOn = false;
var mediasource;
var playbuttonbar = false; //command bar embedded actived
var mutebuttonbar = false; //command bar embedded actived
var timerID = undefined;
var timerToRecomLoop = undefined;
// var timeToInactivity=3000;
var timeToLoopRecom = 60000;
var timeToInactivity = 200000; //(200 seconds)

var deletedObj = [];
var isUserInteracting = false;
var video;
var videoMentor;
var controls;

var videoControl;
var audioElement = [];
var playButtonOnControlsBarRef;
var stopButtonOnControlsBarRef;
var progressBar = document.getElementById("progress-bar");
progressBar.addEventListener("click", seek);
var container = document.getElementById("container");
var containerUseInnerHeight = $("#container").first().innerHeight();
var containerUseInnerWidth = $("#container").first().innerWidth();
// container.style.backgroundColor ='rgba(11, 11, 29, 0.93)';
var loaderDiv = document.createElement("div");
var imgCompass = document.createElement("img");

//WEB WORKER
var playerEngineWork;
var playerTimeWork;
var playerProgressBar;
var playerEventEngineWork;
var playerRecommEngineWork;
var playerWindowResizeEngineWork;
var playerActivityEngineWork;
var playerMouseOverEngineWork;

var drivehotspotlayer = 0;
var loopOption = false;
//dati mock per provare la nuova gestione alpha mia (PL) configurazione in locale "alpha"
// in alternativa per fare un test degli effetti del weight
//1 creare una configurazione
//2 prendere tutti gli _id degli elementi e inserirli  nel json sottostante
//3 impostare il parametro paramtotest=true , se il parametro è false il comportamento è normale cioè parte la richiesta ai servizi recom
var result = {
  message: {
    body: {
      message: [
        { weight: 1, _id: "5d8b6236e852ece9394ec0be" },
        { weight: 0.88, _id: "5d8b6236e852ece9394ec0bc" },
        { weight: 0.5621, _id: "5d8b6236e852ece9394ec0ba" },
        { weight: 0.4, _id: "5d8b6236e852ece9394ec0b8" },
        { weight: 0.4, _id: "5d8cc566cbccbceba3885a75" },
        { weight: 0.88, _id: "5d8b7f02e852ece9394ecdab" },
        { weight: 0.88, _id: "5d8b7f02e852ece9394ecda9" },
        { weight: 0.4, _id: "5d8b7f02e852ece9394ecda7" },
        { weight: 0.88, _id: "5d8b7f02e852ece9394ecda5" },
      ],
    },
  },
};

var paramtotest = false;
//fine dati mock per provare la nuova gestione alpha

/*
 * GUI : https://github.com/dataarts/dat.gui
 * START
 */
//video selected
var videoSelected;
var objVideoSelected;
var video2dObject;

var minutes = "";
var seconds = "";

var drivehotspotsQueue = [];

/*
 * GUI : https://github.com/dataarts/dat.gui
 * END
 */

/*var capturer360 = new CCapture({
format: 'threesixty',
display: true,
});*/
function createVideo() {
  //video = document.createElement('video');
  video = document.getElementById("mediavideoh360");
  video.loop = loopOption;
  video.muted = false;
  video.setAttribute("playsinline", "true");
  video.removeAttribute("controls");
  video.playsinline = true;
  video.poster = domain + "/resources/video/assets/logo.png";
  video.crossOrigin = "anonymous";

  if (uploaded) {
    if (uploaded === "YES") {
      console.log("stai usando amazon");
      video.src = getAWSUrl(group) + resourceName + ".mp4";
    } else {
      console.log("non stai usando amazon");
      video.src =
        domain + "/H360/stream?path=" + resourceName + "&group=" + group; //+group
    }
  } else {
    video.src =
      domain + "/H360/stream?path=" + resourceName + "&group=" + group; //+group
  }
  video.setAttribute("webkit-playsinline", "webkit-playsinline");
  //video.setAttribute('id', 'video');
  if (typeof Worker !== "undefined") {
    if (typeof playerTimeWork === "undefined") {
      playerTimeWork = new Worker(timework);
    }
    if (typeof playerProgressBar === "undefined") {
      playerProgressBar = new Worker(progresswork);
    }
  } else {
    console.log("NO WORKER");
  }

  video.addEventListener("timeupdate", UpdateTheTime, { passive: true });
  //video.addEventListener('seeked', cleaningEngine, false)
  videoControl = new VideoControl(video);

  // Function invoked when the video is ready to play (that could be called more time)
  var checkOncanplay = false;
  var initialStatusBottonPlay = false;
  video.oncanplay = function () {
    if (container.contains(loaderDiv)) {
      container.removeChild(loaderDiv);
    }
    document.body.classList.remove("fade");

    if (!checkOncanplay) {
      minutes = parseInt(video.duration / 60);
      seconds = video.duration % 60;
      sendMessage({ type: "loading", status: false, duration: video.duration });
      if (document.getElementById("embtimediv")) {
        if (parseInt(seconds) < 10) {
          seconds = "0" + parseInt(seconds);
        }
        var sec = parseFloat(seconds);
        document.getElementById("embtimediv").innerHTML =
          "0:00/" +
          minutes +
          ":" +
          (sec.toFixed(0) >= 10 ? sec.toFixed(0) : "0" + sec.toFixed(0));
      }
      checkOncanplay = true;
      loadConfigurationStored(true); //parametro  serve ad abilitare o meno l'aggiornamento del dato o fare solo la chiamata fake

      timeToInactivity = (video.duration - 1) * 1000;
      if (typeof Worker !== "undefined") {
        if (typeof playerActivityEngineWork == "undefined") {
          playerActivityEngineWork = new Worker(playerActivityWork);
        }
      }
    }
  };
  video.addEventListener("ended", endVideoEvent);
}

function init() {
  if (typeof Worker !== "undefined") {
    if (typeof playerEngineWork == "undefined") {
      playerEngineWork = new Worker(enginework);
    }
  }

  if (typeof Worker !== "undefined") {
    if (typeof playerMouseOverEngineWork == "undefined") {
      playerMouseOverEngineWork = new Worker(mouseOverWork);
    }
  }

  RwdOn = false;
  if (camera === undefined) {
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
  }
  scene = new THREE.Scene();
  cssScene = new THREE.Scene();
  // Camera setup
  camera.position.z = 5;
  camera.updateProjectionMatrix();

  // Add main video sphere to scene
  videoSphere = createVideoSphere(videoSphereRadius, video);
  scene.add(videoSphere);

  /* CSS2DRenderer
   * STEP MENTOR - START
   */
  /*var mentorTemp = createVideoSphereChromakey(videoSphereRadius,domain + '/H360/stream?path='+'CERTH_MENTHOR'+'&group='+group,'#00d900');
	videoSphereMentor = mentorTemp[0];
	videoSphereMentorMaterial = mentorTemp[1];
	scene.add(videoSphereMentor);
	videoSphereMentorMaterial.startVideo();*/
  /*
   * STEP MENTOR - END
   */

  // Set camera aspect ratio
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(new THREE.Color(0xeeeeee, 1.0));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  //renderer.domElement.style.zIndex = "1"; // required
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.zIndex = 0;

  cssRenderer = new THREE.CSS3DRenderer();
  //size must be equals to renderer size, otherwise the coordinate are different
  cssRenderer.setSize(container.clientWidth, container.clientHeight);
  cssRenderer.domElement.style.position = "absolute";
  cssRenderer.domElement.style.top = 0;
  cssRenderer.domElement.style.zIndex = 0;
  container.appendChild(renderer.domElement);
  container.appendChild(cssRenderer.domElement);

  // Container and window event listener setup
  container.addEventListener("click", onDocumentMouseClick, false); //RAYCASTER LISTENER: video2d, shape
  container.addEventListener("mousemove", onDocumentMouseMove, false);
  container.addEventListener('mouseover', onDocumentMouseOver, false);
  //container.addEventListener('wheel', onDocumentMouseWheel, false)
  imgCompass.classList.add("rotateParam");
  //per permettere di girare la sfera
  controls = new THREE.OrbitControls(camera, cssRenderer.domElement);
  //controls.screenSpacePanning = false;
  controls.screenSpacePanning = false;
  if (typeof initialDegreeX !== "undefined") {
    if (initialDegreeX) {
      camera.position.x = initialDegreeX;
    } else {
      camera.position.x = 90;
    } //valore di default preso in modo sperimentale
  } else {
    camera.position.x = 90;
  }
  if (typeof initialDegreeY !== "undefined") {
    if (initialDegreeY) {
      camera.position.y = initialDegreeY;
    } else {
      camera.position.y = 5.5194085358;
    } //valore di default preso in modo  sperimentale
  } else {
    camera.position.y = 5.5194085358;
  }
  if (typeof initialDegreeZ !== "undefined") {
    if (initialDegreeZ) {
      camera.position.z = initialDegreeZ;
    } else {
      camera.position.z = 5.000000000000009;
    } //valore di default preso in modo  sperimentale
  } else {
    camera.position.z = 5.000000000000009;
  }

  controls.update();
  controls.enableZoom = false;
  controls.enableDamping = true;
  controls.dampingFactor = 1;
  if (document.fullscreenEnabled) {
    document.addEventListener("fullscreenchange", onWindowResize);
  }

  window.addEventListener("resize", onWindowResize, false);
  window.addEventListener("message", receiveMessage, false); // Trigger on input postMessage
}
//funzione che setta il time per il loop delle chiamate recom
function settingRecomLoopRequest() {
  if (recomCheck === "true") {
    console.log("settingRecomLoopRequest");
    if (timerToRecomLoop === undefined) {
      timerToRecomLoop = setTimeout(recomLoopRequest, timeToLoopRecom);
    } else {
      clearTimeout(timerID);
      timerToRecomLoop = setTimeout(recomLoopRequest, timeToLoopRecom);
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  cssRenderer.render(cssScene, camera);

  videoSphereMentorMaterial ? videoSphereMentorMaterial.update() : "";
  render();
  var angleZ = THREE.Math.radToDeg(controls.getAzimuthalAngle());
  var realAngleZ = angleZ - 86.82016988013577; //valore preso in modo sperimentale per posizonare la bussola

  var angleX = THREE.Math.radToDeg(controls.getPolarAngle()); //valore preso in modo sperimentale per posizonare la bussola
  // console.log("angleZ")
  var realAngleX = angleX - 86.49602025400586;

  imgCompass.style.setProperty(
    "--rotate",
    "rotateZ(" + realAngleZ + "deg) rotateX(" + realAngleX + "deg)"
  );
}

function fullscreen() {
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.msRequestFullscreen) {
    video.msRequestFullscreen();
  } else if (video.mozRequestFullScreen) {
    video.mozRequestFullScreen();
  } else if (container.webkitRequestFullscreen) {
    video.webkitRequestFullscreen();
  }
}

function onFullscreen() {}
function recomLoopRequest() {
  console.log("recomLoopRequest");
  // loadConfigurationWeight(boxobjs,false);
  loadConfigurationStored(false); //parametro  serve ad abilitare o meno l'aggiornamento del dato o fare solo la chiamata fake
  // settingRecomLoopRequest();
}

function checkOptionsPlay(callback) {
  if (video) {
    var playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then((_) => {
          setupPlayerVideo();
          callback(undefined, true);
        })
        .catch((error) => {
          // Auto-play was prevented
          // Show paused UI.
          if (error.name === "NotAllowedError") {
            //show ui for manual play
            if (typeof autoplay !== "undefined") {
              if (autoplay === "true") {
                $("#modalmanualplay")
                  .modal({
                    centered: true,
                    transition: "fade",
                    onHidden: function () {
                      setupPlayerVideo();
                      video.play();
                      callback(error, true);
                    },
                    onShow: function () {
                      var myFrame = $("#modalmanualplay").html(
                        "<img name=manualPlay src=" +
                          domain +
                          "/resource/photo/playImage.png" +
                          " style=width:128px;height:128px;margin-left:44% onClick=setupPlayerVideo(this)><div style=text-align:center!important;font-size: 14px!important;line-height: 2!important;> </br>" +
                          (group !== "RBB"
                            ? "Your browser does not support Autoplay </br> </br> Please change your settings or start the video manually"
                            : "Your browser does not support Autoplay </br> </br> Please change your settings or start the video manually") +
                          "</div>"
                      );
                    },
                  })
                  .modal("show");
              } else {
                // Handle a load or playback error
                initialStatusBottonPlay = false;
                configEngine(initialStatusBottonPlay);
                callback(error, true);
              }
            }
          } else {
            // Handle a load or playback error
            initialStatusBottonPlay = false;
            configEngine(initialStatusBottonPlay);
            callback(error, true);
          }
        });
    }
  }
}

function setupPlayerVideo(target) {
  if (typeof seekparam !== "undefined") {
    if (seekparam) {
      video.currentTime = parseFloat(seekparam);
    }
  }
  if (typeof controlsparam !== "undefined") {
    if (controlsparam === "false") {
      initialStatusBottonPlay = true;
    }
  }
  if (typeof autoplay !== "undefined") {
    if (autoplay === "true") {
      // Automatic playback started!
      // Show playing UI.
      initialStatusBottonPlay = true;
      video.play();
    } else {
      initialStatusBottonPlay = false;
      //   video.currentTime = 0.01;
      videoControl.pauseVideo();
    }
  }
  configEngine(initialStatusBottonPlay);

  if (target) {
    if (target.name === "manualPlay") {
      $("#modalmanualplay").modal("hide");
    }
  }
  video.currentTime = 0.1;
  if ((typeof time !== "undefined")&&( time !== "")) {
      if (time>video.duration){        
        video.currentTime = video.duration;
      }else{
        video.currentTime = parseFloat(time);
      }      

  }
}

function onWindowResize() {
  // Set the renderer size based on the container size
  renderer.setSize(container.clientWidth, container.clientHeight);
  cssRenderer.setSize(container.clientWidth, container.clientHeight);
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  controls.update();
  containerUseInnerHeight = container.clientHeight;
  containerUseInnerWidth = container.clientWidth;

  //windowResizeWork
  /***
   * ONLY FOR ELEMENT "ON TOP" IMAGE AND AUDIO
   */
  if (typeof Worker !== "undefined") {
    if (typeof playerWindowResizeEngineWork == "undefined") {
      playerWindowResizeEngineWork = new Worker(windowResizeWork);
    }
    playerWindowResizeEngineWork.postMessage({
      boxobjs: JSON.parse(JSON.stringify(boxobjs)),
    });
    playerWindowResizeEngineWork.onmessage = function (event) {
      switch (event.data.type) {
        case "imageOnTopResizeEvent":
          imageOnTopResizeFromProperties(
            boxobjs[event.data.item].properties,
            boxobjs[event.data.item],
            containerUseInnerHeight,
            containerUseInnerWidth
          );
          break;
        case "audioOnTopResizeEvent":
          audioOnTopResizeFromProperties(
            boxobjs[event.data.item].properties,
            boxobjs[event.data.item],
            containerUseInnerHeight,
            containerUseInnerWidth
          );
          break;
        default:
          break;
      }
    };
  }
}

function onDocumentMouseMove(event) {
  if (playerActivityEngineWork) {
    playerActivityEngineWork.postMessage({
      timeInactivity: timeToInactivity,
    });
    playerActivityEngineWork.onmessage = function (event) {
      console.log("pause video" + initialStatusBottonPlay);
      // videoControl.pauseVideo();
      controlsBarEventManage(
        playButtonOnControlsBarRef,
        videoControl,
        true,
        false,
        function (newplaybuttonbar, newmutebuttonbar) {
          playbuttonbar = newplaybuttonbar;
          mutebuttonbar = newmutebuttonbar;
        }
      );
    };
  }
}

function onDocumentMouseClick(event) {
  event.preventDefault();
  // Coordinates relative to the scene container, not relative to the entire window
  var containerX = event.pageX - $("#container").offset().left;
  var containerY = event.pageY - $("#container").offset().top;

  // NOTE: (-1,-1) is the lower left corner. (1,1) is the upper right corner
  var mouse = new THREE.Vector2();
  mouse.x = (containerX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(containerY / renderer.domElement.clientHeight) * 2 + 1;

  // Raycaster
  var ray = new THREE.Raycaster();
  ray.setFromCamera(mouse, camera);
  var intersected = false;
  for (var i = 0; i < boxobjs.length; i++) {
    //you must verify if the object is inserted in the scene - raycaster work also with object not inserted in the scene
    if (
      boxobjs[i].category !== "htmlpage" &&
      boxobjs[i].category !== "text" &&
      boxobjs[i].category !== "textline" &&
      boxobjs[i].category !== "image" &&
      boxobjs[i].category !== "audio" &&
      scene.getObjectByName(boxobjs[i].objIdentifier) !== undefined
    ) {
      if (boxobjs[i].obj.groupcommands && boxobjs[i].category === "video2d") {
        if (
          ray.intersectObject(boxobjs[i].obj.groupcommands.children[0], true)
            .length > 0
        ) {
          console.log("PLAY");
          if (videoSelected) {
            // console.log(JSON.stringify(video2dObject))
            if (video2dObject) {
              if (id) {
                requestSemanticEngine(id, [video2dObject], video, "playback");
              }
            }
            videoSelected.play();
          }
        } else if (
          ray.intersectObject(boxobjs[i].obj.groupcommands.children[1], true)
            .length > 0
        ) {
          console.log("PAUSE");
          if (videoSelected) {
            videoSelected.pause();
          }
        } else if (
          ray.intersectObject(boxobjs[i].obj.groupcommands.children[2], true)
            .length > 0
        ) {
          console.log("CANCEL");
          if (videoSelected) {
            videoSelected.pause();
            videoSelected = undefined;
          }
          boxobjs[i].obj.remove(boxobjs[i].obj.groupcommands);
          if (objVideoSelected) {
            scene.remove(objVideoSelected);
          }
        }
      }
      if (
        typeof ray.intersectObject === "function" &&
        boxobjs[i].category === "shape"
      ) {
        if (ray.intersectObject(boxobjs[i].obj, true).length > 0) {
          // safe to use the function
          intersected = true;
          if (id) {
            requestSemanticEngine(id, [boxobjs[i]], video, "click");
          }
          eventObjectThreejsPureListenerH360(boxobjs[i].properties);
          /*if (boxobjs[i].link) { //LINK ASSOCIATED TO A OBJECT
						window.open(boxobjs[i].link, '_blank')
					}*/
        }
      }
    }
  }
}

function onDocumentMouseOver(event) {
  //console.log(event.target.properties);
  if (playerMouseOverEngineWork && event.target.properties) {
    playerMouseOverEngineWork.postMessage({
      properties: event.target.properties,
    });
    playerMouseOverEngineWork.onmessage = function (msg) {
      if (msg.data.type === "link") {
        container.style.cursor =
          "url(/resources/video/assets/cursors/clickpointer.png), auto";
      } else if (msg.data.type === "jump") {
        container.style.cursor =
          "url(/resources/video/assets/cursors/clickpointer.png), auto";
      } else if (msg.data.type === "drivehotspot") {
        container.style.cursor =
          "url(/resources/video/assets/cursors/clickpointer.png), auto";
      }else if (msg.data.type === "cover") {
        container.style.cursor =
          "url(/resources/video/assets/cursors/clickpointer.png), auto";
      } 
      else {
        container.style.cursor = "";
      }
    };
  } else {
    container.style.cursor = "";
  }
}

function render() {
  //web work instance
  if (typeof Worker !== "undefined") {
    // if (typeof(playerEngineWork) == "undefined") {
    // 	playerEngineWork = new Worker(enginework);
    // }
    playerEngineWork.postMessage({
      boxobjs: JSON.parse(JSON.stringify(boxobjs)),
      currentTime: video.currentTime,
    });
    playerEngineWork.onmessage = function (event) {
      switch (event.data.type) {
        case "currentelements":
          sendMessage(event.data);
          break;
        case "imageBeahaviourOnTopFromProperties":
          imageBeahaviourOnTopFromProperties(
            boxobjs[event.data.item].properties,
            boxobjs[event.data.item],
            containerUseInnerHeight,
            containerUseInnerWidth
          ); //useImageEngine.js
          break;
        case "metadataBeahaviourOnTopFromProperties":
          metadataBeahaviourOnTopFromProperties(
            boxobjs[event.data.item].properties,
            containerUseInnerHeight,
            containerUseInnerWidth
          ); //useImageEngine.js
          break;
        case "metadatabeahaviourshow":
          metadataengineshow(boxobjs[event.data.item]);
          break;
        case "metadatabeahaviourhide":
          metadataenginehide(boxobjs[event.data.item]);
          break;
        case "metadarabeahaviourfulltime":
          metadataenginefulltime(boxobjs[event.data.item]);
          break;
        case "htmlpageBeahaviourOnTopFromProperties":
          htmlpageBeahaviourOnTopFromProperties(
            boxobjs[event.data.item].properties,
            containerUseInnerHeight,
            containerUseInnerWidth
          ); //useHtmlEngine.js
          break;
        case "textBeahaviourOnTopFromProperties":
          textBeahaviourOnTopFromProperties(
            boxobjs[event.data.item].properties,
            boxobjs[event.data.item],
            containerUseInnerHeight,
            containerUseInnerWidth
          ); //useTextEngine.js
          break;
        case "textlineBeahaviourOnTopFromProperties":
          textlineBeahaviourOnTopFromProperties(
            boxobjs[event.data.item].properties
          ); //useTextlineEngine.js
          break;
        case "audioBeahaviourOnTopFromProperties":
          audioBeahaviourOnTopFromProperties(
            boxobjs[event.data.item].properties,
            boxobjs[event.data.item],
            containerUseInnerHeight,
            containerUseInnerWidth
          ); //useAudioEngine.js
          break;
        case "novo":
          cssThreejsObjectManagement(boxobjs[event.data.item], event.data.item);
          break;
        case "videoBeahaviourOnTopFromProperties":
          videoBeahaviourOnTopFromProperties(
            boxobjs[event.data.item].properties,
            {
              playListenerVideo2D: playListenerVideo2D,
              pauseListenerVideo2D: pauseListenerVideo2D,
              endedListenerVideo2D: endedListenerVideo2D,
            },
            containerUseInnerHeight,
            containerUseInnerWidth
          ); //useAudioEngine.js

          // console.log(boxobjs[event.data.item])
          // if (boxobjs[event.data.item].videorefer.currentTime > 0){
          // 		console.log("si ")
          // }
          // if(boxobjs[event.data.item].properties.stopback === true && boxobjs[event.data.item].videorefer.currentTime > 0){
          // 	//block video master
          // 	controlsBarEventManage(playButtonOnControlsBarRef, videoControl, true, false, function (newplaybuttonbar, newmutebuttonbar) {
          // 		playbuttonbar = newplaybuttonbar;
          // 		mutebuttonbar = newmutebuttonbar;
          // 	})
          // }
          break;
        case "novo2":
          threejsObjectManagement(boxobjs[event.data.item]);
          break;
        case "imageBeahaviourOnTopHideFromProperties":
          imageBeahaviourOnTopHideFromProperties(
            boxobjs[event.data.item].properties
          ); //useAudioEngine.js
          break;
        case "metadataBeahaviourOnTopHideFromProperties":
          metadataBeahaviourOnTopHideFromProperties(
            boxobjs[event.data.item].properties
          ); //useAudioEngine.js
          break;
        case "htmlpageBeahaviourOnTopHideFromProperties":
          htmlpageBeahaviourOnTopHideFromProperties(
            boxobjs[event.data.item].properties
          ); //useAudioEngine.js
          break;
        case "textBeahaviourOnTopHideFromProperties":
          textBeahaviourOnTopHideFromProperties(
            boxobjs[event.data.item].properties
          ); //useAudioEngine.js
          break;
        case "textlineBeahaviourOnTopHideFromProperties":
          textlineBeahaviourOnTopHideFromProperties(
            boxobjs[event.data.item].properties
          );
          break;
        case "audioBeahaviourOnTopHideFromProperties":
          audioBeahaviourOnTopHideFromProperties(
            boxobjs[event.data.item].properties
          ); //useAudioEngine.js
          break;
        case "novohide":
          if (
            boxobjs[event.data.item].properties.mentor === true &&
            boxobjs[event.data.item].properties.mentorsnippet === false
          ) {
            scene.remove(boxobjs[event.data.item].obj[0]);
            break;
          }
          cssScene.remove(boxobjs[event.data.item].obj[0]);
          if (boxobjs[event.data.item].category === "audio") {
            boxobjs[event.data.item].obj[2].pause();
            boxobjs[event.data.item].obj[2].currentTime = 0.0;
            boxobjs[event.data.item].obj[3].className =
              "big play circle fitted icon";
          } else if (boxobjs[event.data.item].category === "video2d") {
            boxobjs[event.data.item].videorefer.pause();
            boxobjs[event.data.item].videorefer.currentTime = 0.0;
          }
          break;
        case "videoBeahaviourOnTopHideFromProperties":
          videoBeahaviourOnTopHideFromProperties(
            boxobjs[event.data.item].properties
          ); //useAudioEngine.js
          if (boxobjs[event.data.item].properties.stopback === true) {
            //block video master
            controlsBarEventManage(
              playButtonOnControlsBarRef,
              videoControl,
              false,
              false,
              function (newplaybuttonbar, newmutebuttonbar) {
                playbuttonbar = newplaybuttonbar;
                mutebuttonbar = newmutebuttonbar;
              }
            );
          }
          break;
        case "novohide2":
          scene.remove(boxobjs[event.data.item].obj);
          if (
            boxobjs[event.data.item].category === "video2d" &&
            boxobjs[event.data.item].videorefer
          ) {
            if (boxobjs[event.data.item].videorefer.currentTime > 0) {
              boxobjs[event.data.item].videorefer.pause();
              boxobjs[event.data.item].videorefer.currentTime = 0.0;
            }
          }
          break;
        case "toclean":
          // playerEngineWork.terminate();
          // playerEngineWork = undefined;
          break;
        case "jump":
          // console.log("recomCheck:"+ recomCheck)
          // console.log("recommendation:"+recommendation)

          

          if (uploaded) {
            if (!event.data.actionOptions) {
              window.location.href =
                domain +
                "/H360/use?processId=" +
                event.data.idConfig +
                "&resourceName=" +
                event.data.idVideo +
                "&controls=true&postmsg=false&seek=" +
                event.data.tStart +
                "&autoplay=true" +
                "&group=" +
                group +
                "&uploaded=" +
                uploaded +
                "&recommendation=" +
                recommendation.toString() +
                "&recomCheck=" +
                recomCheck.toString() +
                "&id=" +
                id;
            } else {
              if (
                event.data.actionOptions.initialDegree === "defaultview" ||
                event.data.actionOptions.initialDegree === "" ||
                !event.data.actionOptions.initialDegree
              ) {
                let path =
                  domain +
                  "/H360/use?processId=" +
                  event.data.idConfig +
                  "&resourceName=" +
                  event.data.idVideo +
                  "&controls=true&postmsg=false&seek=" +
                  event.data.tStart +
                  "&group=" +
                  group +
                  "&autoplay=true" +
                  "&uploaded=" +
                  uploaded +
                  "&recommendation=" +
                  recommendation.toString() +
                  "&recomCheck=" +
                  recomCheck.toString() +
                  "&id=" +
                  id
                  ;
                  if ( typeof  event.data.actionOptions.synchronized !== 'undefined' ){
                    if (event.data.actionOptions.synchronized){
                      path=path+"&time="+video.currentTime;
                    }
                  }
                  window.location.href=path;
              } else if (event.data.actionOptions.initialDegree === "takeoff") {
                let path =
                  domain +
                  "/H360/use?processId=" +
                  event.data.idConfig +
                  "&resourceName=" +
                  event.data.idVideo +
                  "&controls=true&postmsg=false&seek=" +
                  event.data.tStart +
                  "&group=" +
                  group +
                  "&autoplay=true" +
                  "&initialDegreeX=" +
                  camera.position.x +
                  "&initialDegreeY=" +
                  camera.position.y +
                  "&initialDegreeZ=" +
                  camera.position.z +
                  "&uploaded=" +
                  uploaded +
                  "&recommendation=" +
                  recommendation.toString() +
                  "&recomCheck=" +
                  recomCheck.toString() +
                  "&id=" +
                  id;
                  if ( typeof  event.data.actionOptions.synchronized !== 'undefined' ){
                    if (event.data.actionOptions.synchronized){
                      path=path+"&time="+video.currentTime;
                    }
                  }
                  window.location.href=path;
              }
            }
          } else {
            if (!event.data.actionOptions) {
              window.location.href =
                domain +
                "/H360/use?processId=" +
                event.data.idConfig +
                "&resourceName=" +
                event.data.idVideo +
                "&controls=true&postmsg=false&seek=" +
                event.data.tStart +
                "&autoplay=true" +
                "&group=" +
                group +
                "&recommendation=" +
                recommendation.toString() +
                "&recomCheck=" +
                recomCheck.toString() +
                "&id=" +
                id;
            } else {
              if (
                event.data.actionOptions.initialDegree === "defaultview" ||
                event.data.actionOptions.initialDegree === "" ||
                !event.data.actionOptions.initialDegree
              ) {
                let path =
                  domain +
                  "/H360/use?processId=" +
                  event.data.idConfig +
                  "&resourceName=" +
                  event.data.idVideo +
                  "&controls=true&postmsg=false&seek=" +
                  event.data.tStart +
                  "&group=" +
                  group +
                  "&autoplay=true" +
                  "&recommendation=" +
                  recommendation.toString() +
                  "&recomCheck=" +
                  recomCheck.toString() +
                  "&id=" +
                  id;
                  if ( typeof  event.data.actionOptions.synchronized !== 'undefined' ){
                    if (event.data.actionOptions.synchronized){
                      path=path+"&time="+video.currentTime;
                    }
                  }
                  window.location.href=path;
              } else if (event.data.actionOptions.initialDegree === "takeoff") {
                let path =
                  domain +
                  "/H360/use?processId=" +
                  event.data.idConfig +
                  "&resourceName=" +
                  event.data.idVideo +
                  "&controls=true&postmsg=false&seek=" +
                  event.data.tStart +
                  "&group=" +
                  group +
                  "&autoplay=true" +
                  "&initialDegreeX=" +
                  camera.position.x +
                  "&initialDegreeY=" +
                  camera.position.y +
                  "&initialDegreeZ=" +
                  camera.position.z +
                  "&recommendation=" +
                  recommendation.toString() +
                  "&recomCheck=" +
                  recomCheck.toString() +
                  "&id=" +
                  id;
                  if ( typeof  event.data.actionOptions.synchronized !== 'undefined' ){
                    if (event.data.actionOptions.synchronized){
                      path=path+"&time="+video.currentTime;
                    }
                  }
                  window.location.href=path;
              }
            }
          }
          break;
        default:
          break;
      }
    };
    videoSphere.needsUpdate = true;
  } else {
    console.log("No Web Worker support.");
  }
}

function UpdateTheTime() {
  //called every 0.25 ms
  //web work instance
  if (typeof Worker !== "undefined") {
    //TIME WORKERs
    if (typeof controlsparam !== "undefined") {
      if (controlsparam === "true") {
        if (typeof playerTimeWork !== "undefined") {
          playerTimeWork.postMessage({
            currentTime: video.currentTime,
            minutes: minutes,
            seconds: seconds,
            duration: video.duration,
          });
          playerTimeWork.onmessage = function (event) {
            var embtimediv = document.getElementById("embtimediv");
            if (embtimediv) {
              embtimediv.innerHTML = event.data.value;
            }
          };
        }
      }
    }
    //PROGRESSBAR WORKER
    // if (typeof(playerProgressBar) === "undefined") {
    // 	playerProgressBar = new Worker(progresswork);
    // }
    if (typeof playerProgressBar !== "undefined") {
      playerProgressBar.postMessage({
        currentTime: video.currentTime,
        duration: video.duration,
      });
      playerProgressBar.onmessage = function (event) {
        // Update the progress bar's value
        progressBar.value = event.data.value;
        // playerProgressBar.terminate();
        // playerProgressBar = undefined;
        // Update the progress bar's text (for browsers that don't support the progress element)
      };
    }
  } else {
    console.log("No Web Worker support.");
  }
}

function cssThreejsObjectManagement(item, index) {
  if (
    item.properties.mentor === true &&
    item.properties.mentorsnippet === false
  ) {
    if (!scene.getObjectByName(item.objIdentifier)) {
      scene.add(item.obj[0]);
      if (typeof item.obj[1].startVideo === "function") {
        // safe to use the function
        item.obj[1].startVideo();
      }
    }
    if (typeof item.obj[1].update === "function") {
      // safe to use the function
      item.obj[1].update();
    }
    return;
  }
  //console.log("cssThreejsObjectManagement")
  if (!cssScene.getObjectByName(item.objIdentifier)) {
    var resultDeletedObj = deletedObj.includes(item.objIdentifier);
    //  console.log(resultDeletedObj)
    if (!resultDeletedObj) {
      cssScene.add(item.obj[0]);
      item.obj[0].lookAt(0, 0, 0);
      if (typeof item.properties.vo !== "undefined") {
        if (item.properties.vo.fov) {
          console.log("FOV");
          // auto rotate
          controls.autoRotate = true;
          controls.autoRotateSpeed = 3;
          controls.minAzimuthAngle = getAngle(item.x, item.y);
          controls.maxAzimuthAngle = getAngle(item.x, item.y);

          //controls.minPolarAngle = getAngle(item.y, item.z); // radians
          //controls.maxPolarAngle = getAngle(item.y, item.z); // radians
          //controls.minPolarAngle = 0; // radians
          //controls.maxPolarAngle = Math.PI/2; // radians
        }
      }
      if (item.category === "audio") {
        //AUDIO autoplay managing
        //audioBeahaviourOnTopFromProperties()
        item.obj[4].myIndexArray = index;
        if (item.properties.autoplay) {
          var positional = false;
          if (typeof item.properties.positional !== "undefined") {
            if (item.properties.positional.active === true) {
              positional = true;
              if (item.obj[2].isPlaying === false) {
                stopOtherAudio(index);
                item.obj[2].play();
                item.obj[3].className = "big pause circle fitted icon";
              }
            }
          }
          console.log("readyState = " + item.obj[2].readyState);

          if (!positional) {
            if (item.obj[2].paused) {
              stopOtherAudio(index);
              item.obj[2].play();
              item.obj[3].className = "big pause circle fitted icon";
            }
          }
        }
      } else if (item.category === "video2d") {
        //VIDEO autoplay managing
        if (item.properties.autoplay === true && item.videorefer) {
          item.videorefer.play();
        }
      }
    } // deletedObj
  } else {
    controls.autoRotate = false;
    controls.minAzimuthAngle = -2 * Math.PI;
    controls.maxAzimuthAngle = 2 * Math.PI;
  }
}

function threejsObjectManagement(item) {
  if (!scene.getObjectByName(item.objIdentifier)) {
    if (item.category === "video2d") {
      if (item.videorefer) {
        if (item.videorefer.autoplay) {
          if (item.videorefer.currentTime === 0) {
            item.videorefer.play();
          }
        }
      }
    }
    //console.log(item);
    if (typeof item.properties !== "undefined" && item.properties != null) {
      if (typeof item.properties.vo !== "undefined") {
        if (item.properties.vo.fov) {
          //camera.position.set(item.camerapositionx, item.camerapositiony, 5)//XYZ
          camera.rotation.x += item.camerarotationx;
          camera.rotation.y += item.camerarotationy;
          camera.rotation.z += item.camerarotationz;
          //camera.lookAt(scene.position);
        }
      }
    }
    scene.add(item.obj);
  }
}

function getAngle(x, y) {
  return 1.5 * Math.PI - Math.atan2(y, x);
}

function metadataengineshow(item) {
  var frustum = new THREE.Frustum();
  frustum.setFromMatrix(
    new THREE.Matrix4().multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    )
  );
  if (frustum.containsPoint(item.obj[0].position)) {
    //console.log(item.name);
  }
}

function metadataenginehide(item) {
  //console.log(item);
}

function metadataenginefulltime(item) {
  //console.log(item);
  var frustum = new THREE.Frustum();
  frustum.setFromMatrix(
    new THREE.Matrix4().multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    )
  );
  if (frustum.containsPoint(item.obj[0].position)) {
    //console.log(item.name);
  }
}

// Funzione richiamata al click sulla progress bar
function seek(e) {
  var percent = e.offsetX / this.offsetWidth;
  video.currentTime = percent * video.duration;
  e.target.value = Math.floor(percent / 100);
  e.target.innerHTML = progressBar.value + "% played";
}

//useHtmlEngine.js useImageEngine useTextEngine listener OnTop Object
//audioCompToScene.js imagecomp.js sceneText.js listener
function htmlEventListenerH360(event) {
  event.preventDefault();
  var categorytarget;
  var dataobj;
  if (event.target.data) {
    dataobj = JSON.parse(event.target.data);
    categorytarget = dataobj.category;
  }
  if (categorytarget === "video2d") {
    if (event.target.properties) {
      if (event.target.properties.coveraction === "fullscreen") {
        $("#modalhtmlcontent")
          .modal({
            centered: true,
            transition: "fade",
            onHidden: function () {
              $("#modalhtmlcontent").html("");
              controlsBarEventManage(
                playButtonOnControlsBarRef,
                videoControl,
                false,
                false,
                function (newplaybuttonbar, newmutebuttonbar) {
                  playbuttonbar = newplaybuttonbar;
                  mutebuttonbar = newmutebuttonbar;
                }
              );
            },
            onShow: function () {
              if (event.target.properties.stopback === true) {
                //block video master
                controlsBarEventManage(
                  playButtonOnControlsBarRef,
                  videoControl,
                  true,
                  false,
                  function (newplaybuttonbar, newmutebuttonbar) {
                    playbuttonbar = newplaybuttonbar;
                    mutebuttonbar = newmutebuttonbar;
                  }
                );
              }
              //console.log(event.target.properties.pathresource);
              var autoplayoption = "";
              var loopoption = "";
              if (event.target.properties.autoplay === true) {
                autoplayoption = "autoplay";
              }
              if (event.target.properties.loop === true) {
                loopoption = "loop";
              }

              var myFrame = $("#modalhtmlcontent").html(
                "<video controls crossorigin='anonymous'  controlsList='nodownload' width='100%' " +
                  autoplayoption +
                  " " +
                  loopoption +
                  ">" +
                  "<source src=" +
                  encodeURI(event.target.properties.pathresource) +
                  " type='video/mp4'></video>"
              );
            },
          })
          .modal("show");
      } else if (event.target.properties.coveraction === "embedded") {
        var infoObjVideo2d = makeVideoCssObj(event.target.properties, true);
        //var infoObjVideo2d = makeTextureVideo2d(data.message[i].properties);
        if (infoObjVideo2d.length == 2) {
          var ref = cssScene.getObjectByName(event.target.id, true);
          cssScene.remove(ref);
          infoObjVideo2d[0].position.set(dataobj.x, dataobj.y, dataobj.z);
          infoObjVideo2d[0].lookAt(0, 0, 0);
          infoObjVideo2d[0].name = event.target.id;

          if (event.target.properties.stopback === true) {
            infoObjVideo2d[1].addEventListener("play", playListenerVideo2D);
            infoObjVideo2d[1].addEventListener("playing", playListenerVideo2D);
            infoObjVideo2d[1].addEventListener("pause", pauseListenerVideo2D);
            infoObjVideo2d[1].addEventListener("ended", endedListenerVideo2D);
          }
          cssScene.add(infoObjVideo2d[0]);

          if (event.target.properties.stopback === true) {
            //block video master
            controlsBarEventManage(
              playButtonOnControlsBarRef,
              videoControl,
              true,
              false,
              function (newplaybuttonbar, newmutebuttonbar) {
                playbuttonbar = newplaybuttonbar;
                mutebuttonbar = newmutebuttonbar;
              }
            );
          }
        }
      } else if (event.target.properties.coveraction === "close") {
        var ref = cssScene.getObjectByName(event.target.id, true);
        cssScene.remove(ref);
        controlsBarEventManage(
          playButtonOnControlsBarRef,
          videoControl,
          false,
          false,
          function (newplaybuttonbar, newmutebuttonbar) {
            playbuttonbar = newplaybuttonbar;
            mutebuttonbar = newmutebuttonbar;
          }
        );
        // animate();
      }
    }
    return;
  }
  if (event.target.properties) {
    if (
      event.target.properties.coveraction === "fullscreen" ||
      event.target.properties.coveraction === "" ||
      !event.target.properties.coveraction
    ) {
      if (event.target.properties.link) {
        document.getElementById("pageloading").src =
          event.target.properties.link;
        //block video master
        controlsBarEventManage(
          playButtonOnControlsBarRef,
          videoControl,
          true,
          false,
          function (newplaybuttonbar, newmutebuttonbar) {
            playbuttonbar = newplaybuttonbar;
            mutebuttonbar = newmutebuttonbar;
          }
        );
        $(".ui.basic.modal")
          .modal({
            centered: true,
            transition: "fade",
            onHidden: function () {
              //block video master
              controlsBarEventManage(
                playButtonOnControlsBarRef,
                videoControl,
                false,
                false,
                function (newplaybuttonbar, newmutebuttonbar) {
                  playbuttonbar = newplaybuttonbar;
                  mutebuttonbar = newmutebuttonbar;
                }
              );
            },
          })
          .modal("show");
      }
    } else if (event.target.properties.coveraction === "newwindow") {
      window.open(event.target.properties.link, "_blank");
    } else if (event.target.properties.coveraction === "embedded") {
      var properties = event.target.properties;
      properties.cover = false;
      properties.covertype = "";
      var cssobj = makingCSSObjectWithHTMLpage(properties);
      cssobj[0].position.set(
        event.target.position.x,
        event.target.position.y,
        event.target.position.z
      );
      cssobj[0].lookAt(0, 0, 0);
      cssobj[0].name = event.target.id;
      var ref = cssScene.getObjectByName(event.target.id, true);
      cssScene.remove(ref);
      cssScene.add(cssobj[0]);
    } else if (event.target.properties.coveraction === "close") {
      var ref = cssScene.getObjectByName(event.target.id, true);
      console.log(ref.name);
      deletedObj.push(ref.name);
      // console.log(deletedObj)
      var objIndex = boxobjs.findIndex((x) => x.objIdentifier === ref.name);
      if (objIndex !== -1) {
        boxobjs[objIndex].properties.vo.showhotspot === true
          ? (boxobjs[objIndex].properties.vo.showhotspot = false)
          : (boxobjs[objIndex].properties.vo.showhotspot = true);
        // boxobjs[objIndex].properties.vo.showhotspot === false
      }
      cssScene.remove(ref);
      // animate();
    }
  }
}

var clickCountEventListener = 0;
var clickEventTimer;
//imagecomp.js listener
function eventListenerH360(event) {
  console.log(camera.position.x);
  console.log(camera.position.y);
  console.log(camera.position.z);

  var dataObjSaved = JSON.parse(event.target.data);
  // console.log(dataObjSaved);//dati in piu aggiunti a mano
  // console.log(video.duration);
  // console.log(video.currentTime);
  //   console.log(id);

  event.preventDefault();
  event.stopPropagation();
  //console.log(event.currentTarget.id)
  //web work instance
  if (typeof Worker !== "undefined") {
    if (typeof playerEventEngineWork == "undefined") {
      playerEventEngineWork = new Worker(
        domain + "/resource/view/360/js/use/playerEventEngine.js"
      );
    }
    clickCountEventListener++;
    if (clickCountEventListener === 1) {
      clickEventTimer = setTimeout(function () {
        console.log("single click");

        if (id) {
          requestSemanticEngine(id, [dataObjSaved], video, "click");
        }
        playerEventEngineWork.postMessage({
          properties: JSON.parse(JSON.stringify(event.target.properties)),
          event: 1,
        });
        clickCountEventListener = 0;
      }, 250);
    } else if (clickCountEventListener === 2) {
      clearTimeout(clickEventTimer);
      clickCountEventListener = 0;
      console.log("double click");
      playerEventEngineWork.postMessage({
        properties: JSON.parse(JSON.stringify(event.target.properties)),
        event: 2,
      });
    }
    playerEventEngineWork.onmessage = function (result) {
      switch (
        result.data.type //below there are the different cases to manage
      ) {
        case "modalwindow":
          document.getElementById("pageloading").src = result.data.link;
          $(".ui.basic.modal")
            .modal({
              centered: true,
            })
            .modal("show");
          playerEventEngineWork.terminate();
          playerEventEngineWork = undefined;
          break;
        case "newwindow":
          window.open(result.data.link, "_blank");
          playerEventEngineWork.terminate();
          playerEventEngineWork = undefined;
          break;
        case "empty":
          playerEventEngineWork.terminate();
          playerEventEngineWork = undefined;
          break;
        case "jump":
          // console.log(camera.position.x)
          //
          // console.log(camera.position.y)
          // console.log(camera.position.z)
          //
          // console.log("jump  modificato ")
          // console.log("recomCheck:"+ recomCheck)
          // console.log("recommendation:"+recommendation)

          // console.log("jump " + uploaded)
          if (uploaded) {
            console.log(recommendation.toString());

            if (!result.data.actionOptions) {
              window.location.href =
                domain +
                "/H360/use?processId=" +
                result.data.idConfig +
                "&resourceName=" +
                result.data.idVideo +
                "&controls=true&postmsg=false&seek=" +
                result.data.tStart +
                "&autoplay=true" +
                "&group=" +
                group +
                "&uploaded=" +
                uploaded +
                "&recommendation=" +
                recommendation.toString() +
                "&recomCheck=" +
                recomCheck.toString() +
                "&id=" +
                id;
            } else {
              if (
                result.data.actionOptions.initialDegree === "defaultview" ||
                result.data.actionOptions.initialDegree === "" ||
                !result.data.actionOptions.initialDegree
              ) {
                   let path=
                  domain +
                  "/H360/use?processId=" +
                  result.data.idConfig +
                  "&resourceName=" +
                  result.data.idVideo +
                  "&controls=true&postmsg=false&seek=" +
                  result.data.tStart +
                  "&autoplay=true" +
                  "&group=" +
                  group +
                  "&uploaded=" +
                  uploaded +
                  "&recommendation=" +
                  recommendation.toString() +
                  "&recomCheck=" +
                  recomCheck.toString() +
                  "&id=" +
                  id;
                  if ( typeof result.data.actionOptions.synchronized !== 'undefined' ){
                    if (result.data.actionOptions.synchronized){
                     path=path+"&time="+video.currentTime;
                    }
                  }
                  window.location.href =path;
              } else if (
                result.data.actionOptions.initialDegree === "takeoff"
              ) {
                let path =
                  domain +
                  "/H360/use?processId=" +
                  result.data.idConfig +
                  "&resourceName=" +
                  result.data.idVideo +
                  "&controls=true&postmsg=false&seek=" +
                  result.data.tStart +
                  "&autoplay=true" +
                  "&group=" +
                  group +
                  "&initialDegreeX=" +
                  camera.position.x +
                  "&initialDegreeY=" +
                  camera.position.y +
                  "&initialDegreeZ=" +
                  camera.position.z +
                  "&uploaded=" +
                  uploaded +
                  "&recommendation=" +
                  recommendation.toString() +
                  "&recomCheck=" +
                  recomCheck.toString() +
                  "&id=" +
                  id;
                  if ( typeof result.data.actionOptions.synchronized !== 'undefined' ){
                    if (result.data.actionOptions.synchronized){
                     path=path+"&time="+video.currentTime;
                    }
                  }
                  window.location.href =path;
              }
            }
          } else {
            if (!result.data.actionOptions) {
              window.location.href =
                domain +
                "/H360/use?processId=" +
                result.data.idConfig +
                "&resourceName=" +
                result.data.idVideo +
                "&controls=true&postmsg=false&seek=" +
                result.data.tStart +
                "&autoplay=true" +
                "&group=" +
                group +
                "&recommendation=" +
                recommendation.toString() +
                "&recomCheck=" +
                recomCheck.toString() +
                "&id=" +
                id;
            } else {
              if (
                result.data.actionOptions.initialDegree === "defaultview" ||
                result.data.actionOptions.initialDegree === "" ||
                !result.data.actionOptions.initialDegree
              ) {
               let path =
                  domain +
                  "/H360/use?processId=" +
                  result.data.idConfig +
                  "&resourceName=" +
                  result.data.idVideo +
                  "&controls=true&postmsg=false&seek=" +
                  result.data.tStart +
                  "&autoplay=true" +
                  "&group=" +
                  group +
                  "&recommendation=" +
                  recommendation.toString() +
                  "&recomCheck=" +
                  recomCheck.toString() +
                  "&id=" +
                  id;
                  if ( typeof result.data.actionOptions.synchronized !== 'undefined' ){
                    if (result.data.actionOptions.synchronized){
                     path=path+"&time="+video.currentTime;
                    }
                  }
                  
                  window.location.href =path;
              } else if (
                result.data.actionOptions.initialDegree === "takeoff"
              ) {
                let path =
                  domain +
                  "/H360/use?processId=" +
                  result.data.idConfig +
                  "&resourceName=" +
                  result.data.idVideo +
                  "&controls=true&postmsg=false&seek=" +
                  result.data.tStart +
                  "&autoplay=true" +
                  "&group=" +
                  group +
                  "&initialDegreeX=" +
                  camera.position.x +
                  "&initialDegreeY=" +
                  camera.position.y +
                  "&initialDegreeZ=" +
                  camera.position.z +
                  "&recommendation=" +
                  recommendation.toString() +
                  "&recomCheck=" +
                  recomCheck.toString() +
                  "&id=" +
                  id;
                  if ( typeof result.data.actionOptions.synchronized !== 'undefined' ){
                    if (result.data.actionOptions.synchronized){
                     path=path+"&time="+video.currentTime;
                    }
                  }
                  window.location.href =path;
              }
            }
          }

          //window.location.href='http://localhost:3000/H360/use?processId=config01&resourceName=london&controls=false&postmsg=false&seek=20';
          //video.src = 'http://109.232.32.250/backend/resource/video/360/incoming/vid_2018_07_10_18_15_43_20180711093733_ott.mp4';
          //video.src = 'http://localhost:3000/H360/use?processId=config01&resourceName=london&controls=true&postmsg=false';
          playerEventEngineWork.terminate();
          playerEventEngineWork = undefined;
          break;
        case "link":
          console.log(result.data);

          if (!result.data.actionOptions) {
            if (result.data.link) {
              window.open(result.data.link, "_blank");
            }
          } else {
            if (
              result.data.actionOptions.linkAction === "fullscreen" ||
              result.data.actionOptions.linkAction === "" ||
              !result.data.actionOptions.linkAction
            ) {
              if (result.data.link) {
                document.getElementById("pageloading").src = result.data.link;
                $(".ui.basic.modal")
                  .modal({
                    centered: true,
                  })
                  .modal("show");
              }
            } else {
              window.open(result.data.link, "_blank");
            }
          }

          playerEventEngineWork.terminate();
          playerEventEngineWork = undefined;
          break;
        case "drivehotspot":
          console.log(result.data.id);
          //solo pagine html
          //l elemento html viene visalizzato , alla chiusura della pagina non appare più
          //provo a cancellarlo dalla lista degli elementi canellati

          for (var y = 0; y < result.data.id.length; y++) {
            var objIndexDeletedArraty = deletedObj.indexOf(result.data.id[y]);
            if (objIndexDeletedArraty !== -1) {
              deletedObj.splice(objIndexDeletedArraty, 1);
            }
            var objIndex = boxobjs.findIndex(
              (x) => x.objIdentifier === result.data.id[y]
            );
            if (objIndex !== -1) {
              boxobjs[objIndex].properties.vo.showhotspot === true
                ? (boxobjs[objIndex].properties.vo.showhotspot = false)
                : (boxobjs[objIndex].properties.vo.showhotspot = true);
              if (boxobjs[objIndex].properties.vo.showhotspot === true) {
                var sphericalPoint = new THREE.Spherical();
                sphericalPoint.setFromCartesianCoords(
                  boxobjs[objIndex].x,
                  boxobjs[objIndex].y,
                  boxobjs[objIndex].z
                );
                if (sphericalPoint.radius > 0) {
                  sphericalPoint.radius = sphericalPoint.radius - 50;
                } else {
                  sphericalPoint.radius = sphericalPoint.radius + 50;
                }
                //sphericalPoint.radius = sphericalPoint.radius-10;
                sphericalPoint.makeSafe();
                var objectPosition2 = new THREE.Vector3();
                objectPosition2.setFromSpherical(sphericalPoint);

                if (boxobjs[objIndex].obj.length > 1) {
                  boxobjs[objIndex].obj[0].position.set(
                    objectPosition2.x,
                    objectPosition2.y,
                    objectPosition2.z
                  );
                } else {
                  boxobjs[objIndex].obj.position.set(
                    objectPosition2.x,
                    objectPosition2.y,
                    objectPosition2.z
                  );
                }
                if (
                  boxobjs[objIndex].category === "video2d" &&
                  boxobjs[objIndex].properties.autoplay === true
                ) {
                  var showhotspot = true; //THE OBJECT WILL BE VISIBLE IN THE SCENE - FOR THE TARGET OBJECT
                  if (typeof boxobjs[objIndex].properties.vo !== "undefined") {
                    if (
                      typeof boxobjs[objIndex].properties.vo.showhotspot !==
                      "undefined"
                    ) {
                      showhotspot = boxobjs[objIndex].properties.vo.showhotspot;
                    }
                  }
                  if (showhotspot === true) {
                    boxobjs[objIndex].obj[1].play();
                  }
                }
                drivehotspotsQueue.unshift(objIndex);
                for (var j = 1; j < drivehotspotsQueue.length; j++) {
                  var indexBoxObjs = drivehotspotsQueue[j];
                  if (indexBoxObjs < boxobjs.length) {
                    var sphericalPoint = new THREE.Spherical();
                    sphericalPoint.setFromCartesianCoords(
                      boxobjs[indexBoxObjs].x,
                      boxobjs[indexBoxObjs].y,
                      boxobjs[indexBoxObjs].z
                    );
                    //sphericalPoint.radius = videoSphereRadius-10;
                    sphericalPoint.makeSafe();
                    var objectPosition2 = new THREE.Vector3();
                    objectPosition2.setFromSpherical(sphericalPoint);

                    if (boxobjs[indexBoxObjs].obj.length > 1) {
                      boxobjs[indexBoxObjs].obj[0].position.set(
                        objectPosition2.x,
                        objectPosition2.y,
                        objectPosition2.z
                      );
                    } else {
                      boxobjs[indexBoxObjs].obj.position.set(
                        objectPosition2.x,
                        objectPosition2.y,
                        objectPosition2.z
                      );
                    }
                  }
                }
              } else {
                //HIDE DRIVE HOTSPOT
                //drivehotspotsQueue
                var index = drivehotspotsQueue.indexOf(objIndex);
                if (index > -1) {
                  drivehotspotsQueue.splice(index, 1);
                }
                //bring to up hotspot on the top of the queue
                if (drivehotspotsQueue.length > 0) {
                  var indtoup = drivehotspotsQueue[0];
                  var sphericalPoint = new THREE.Spherical();
                  sphericalPoint.setFromCartesianCoords(
                    boxobjs[indtoup].x,
                    boxobjs[indtoup].y,
                    boxobjs[indtoup].z
                  );
                  if (sphericalPoint.radius > 0) {
                    sphericalPoint.radius = sphericalPoint.radius - 50;
                  } else {
                    sphericalPoint.radius = sphericalPoint.radius + 50;
                  }
                  //sphericalPoint.radius = videoSphereRadius-10;
                  sphericalPoint.makeSafe();
                  var objectPosition2 = new THREE.Vector3();
                  objectPosition2.setFromSpherical(sphericalPoint);

                  if (boxobjs[indtoup].obj.length > 1) {
                    boxobjs[indtoup].obj[0].position.set(
                      objectPosition2.x,
                      objectPosition2.y,
                      objectPosition2.z
                    );
                  } else {
                    boxobjs[indtoup].obj.position.set(
                      objectPosition2.x,
                      objectPosition2.y,
                      objectPosition2.z
                    );
                  }
                }
              }
            }
          }
          playerEventEngineWork.terminate();
          playerEventEngineWork = undefined;
          break;
        default:
          break;
      }
    };
  } else {
    console.log("No Web Worker support.");
  }
}

/*
 * Event only for three.js object - ONLY SINGLE CLICK with raycasting
 */
function eventObjectThreejsPureListenerH360(properties) {
  if (typeof Worker !== "undefined") {
    if (typeof playerEventEngineWork == "undefined") {
      playerEventEngineWork = new Worker(
        domain + "/resource/view/360/js/use/playerEventEngine.js"
      );
    }
    playerEventEngineWork.postMessage({
      properties: JSON.parse(JSON.stringify(properties)),
      event: 1,
    });
    playerEventEngineWork.onmessage = function (result) {
      switch (
        result.data.type //below there are the different cases to manage
      ) {
        case "modalwindow":
          document.getElementById("pageloading").src = result.data.link;
          $(".ui.basic.modal")
            .modal({
              centered: true,
            })
            .modal("show");
          playerEventEngineWork.terminate();
          playerEventEngineWork = undefined;
          break;
        case "newwindow":
          window.open(result.data.link, "_blank");
          playerEventEngineWork.terminate();
          playerEventEngineWork = undefined;
          break;
        case "empty":
          playerEventEngineWork.terminate();
          playerEventEngineWork = undefined;
          break;
        case "jump":
          // console.log("recomCheck: buuu"+ recomCheck)
          // console.log("recommendation:"+recommendation)
          if (!result.data.actionOptions) {
            window.location.href =
              domain +
              "/H360/use?processId=" +
              result.data.idConfig +
              "&resourceName=" +
              result.data.idVideo +
              "&controls=true&postmsg=false&seek=" +
              result.data.tStart +
              "&autoplay=true" +
              "&group=" +
              group +
              "&recommendation=" +
              recommendation.toString() +
              "&recomCheck=" +
              recomCheck.toString() +
              "&id=" +
              id;
          } else {
            if (
              result.data.actionOptions.initialDegree === "defaultview" ||
              result.data.actionOptions.initialDegree === "" ||
              !result.data.actionOptions.initialDegree
            ) {
              let path =
                domain +
                "/H360/use?processId=" +
                result.data.idConfig +
                "&resourceName=" +
                result.data.idVideo +
                "&controls=true&postmsg=false&seek=" +
                result.data.tStart +
                "&group=" +
                group +
                "&autoplay=true" +
                "&recommendation=" +
                recommendation.toString() +
                "&recomCheck=" +
                recomCheck.toString() +
                "&id=" +
                id;
                if ( typeof result.data.actionOptions.synchronized !== 'undefined' ){
                  if (result.data.actionOptions.synchronized){
                   path=path+"&time="+video.currentTime;
                  }
                }
                window.location.href =path;
            } else if (result.data.actionOptions.initialDegree === "takeoff") {
              let path =
                domain +
                "/H360/use?processId=" +
                result.data.idConfig +
                "&resourceName=" +
                result.data.idVideo +
                "&controls=true&postmsg=false&seek=" +
                result.data.tStart +
                "&group=" +
                group +
                "&autoplay=true" +
                "&initialDegreeX=" +
                camera.position.x +
                "&initialDegreeY=" +
                camera.position.y +
                "&initialDegreeZ=" +
                camera.position.z +
                "&recommendation=" +
                recommendation.toString() +
                "&recomCheck=" +
                recomCheck.toString() +
                "&id=" +
                id;
                if ( typeof result.data.actionOptions.synchronized !== 'undefined' ){
                  if (result.data.actionOptions.synchronized){
                   path=path+"&time="+video.currentTime;
                  }
                }
                window.location.href =path;
            }
          }

          // window.location.href=domain+'/H360/use?processId='+result.data.idConfig+'&resourceName='+ result.data.idVideo +'&controls=true&postmsg=false&seek=' +result.data.tStart+'&autoplay=true'+'&group='+group;
          //window.location.href='http://localhost:3000/H360/use?processId=config01&resourceName=london&controls=false&postmsg=false&seek=20';
          //video.src = 'http://109.232.32.250/backend/resource/video/360/incoming/vid_2018_07_10_18_15_43_20180711093733_ott.mp4';
          //video.src = 'http://localhost:3000/H360/use?processId=config01&resourceName=london&controls=true&postmsg=false';
          playerEventEngineWork.terminate();
          playerEventEngineWork = undefined;
          break;
        case "link":
          console.log(result.data);
          if (!result.data.actionOptions) {
            if (result.data.link) {
              window.open(result.data.link, "_blank");
            }
          } else {
            if (
              result.data.actionOptions.linkAction === "fullscreen" ||
              result.data.actionOptions.linkAction === "" ||
              !result.data.actionOptions.linkAction
            ) {
              if (result.data.link) {
                document.getElementById("pageloading").src = result.data.link;
                $(".ui.basic.modal")
                  .modal({
                    centered: true,
                  })
                  .modal("show");
              }
            } else {
              window.open(result.data.link, "_blank");
            }
          }
          // window.open(result.data.link, '_blank');
          playerEventEngineWork.terminate();
          playerEventEngineWork = undefined;
          break;
        case "drivehotspot":
          console.log(result.data.id);
          for (var y = 0; y < result.data.id.length; y++) {
            var objIndexDeletedArraty = deletedObj.indexOf(result.data.id[y]);
            if (objIndexDeletedArraty !== -1) {
              deletedObj.splice(objIndexDeletedArraty, 1);
            }
            var objIndex = boxobjs.findIndex(
              (x) => x.objIdentifier === result.data.id[y]
            );
            if (objIndex !== -1) {
              boxobjs[objIndex].properties.vo.showhotspot === true
                ? (boxobjs[objIndex].properties.vo.showhotspot = false)
                : (boxobjs[objIndex].properties.vo.showhotspot = true);
              if (boxobjs[objIndex].properties.vo.showhotspot === true) {
                var sphericalPoint = new THREE.Spherical();
                sphericalPoint.setFromCartesianCoords(
                  boxobjs[objIndex].x,
                  boxobjs[objIndex].y,
                  boxobjs[objIndex].z
                );
                if (sphericalPoint.radius > 0) {
                  sphericalPoint.radius = sphericalPoint.radius - 50;
                } else {
                  sphericalPoint.radius = sphericalPoint.radius + 50;
                }
                //sphericalPoint.radius = videoSphereRadius-10;
                sphericalPoint.makeSafe();
                var objectPosition2 = new THREE.Vector3();
                objectPosition2.setFromSpherical(sphericalPoint);

                if (boxobjs[objIndex].obj.length > 1) {
                  boxobjs[objIndex].obj[0].position.set(
                    objectPosition2.x,
                    objectPosition2.y,
                    objectPosition2.z
                  );
                } else {
                  boxobjs[objIndex].obj.position.set(
                    objectPosition2.x,
                    objectPosition2.y,
                    objectPosition2.z
                  );
                }
                if (
                  boxobjs[objIndex].category === "video2d" &&
                  boxobjs[objIndex].properties.autoplay === true
                ) {
                  var showhotspot = true; //THE OBJECT WILL BE VISIBLE IN THE SCENE - FOR THE TARGET OBJECT
                  if (typeof boxobjs[objIndex].properties.vo !== "undefined") {
                    if (
                      typeof boxobjs[objIndex].properties.vo.showhotspot !==
                      "undefined"
                    ) {
                      showhotspot = boxobjs[objIndex].properties.vo.showhotspot;
                    }
                  }
                  if (showhotspot === true) {
                    boxobjs[objIndex].obj[1].play();
                  }
                }
                drivehotspotsQueue.unshift(objIndex);
                for (var j = 1; j < drivehotspotsQueue.length; j++) {
                  var indexBoxObjs = drivehotspotsQueue[j];
                  if (indexBoxObjs < boxobjs.length) {
                    var sphericalPoint = new THREE.Spherical();
                    sphericalPoint.setFromCartesianCoords(
                      boxobjs[indexBoxObjs].x,
                      boxobjs[indexBoxObjs].y,
                      boxobjs[indexBoxObjs].z
                    );
                    //sphericalPoint.radius = videoSphereRadius-10;
                    sphericalPoint.makeSafe();
                    var objectPosition2 = new THREE.Vector3();
                    objectPosition2.setFromSpherical(sphericalPoint);

                    if (boxobjs[indexBoxObjs].obj.length > 1) {
                      boxobjs[indexBoxObjs].obj[0].position.set(
                        objectPosition2.x,
                        objectPosition2.y,
                        objectPosition2.z
                      );
                    } else {
                      boxobjs[indexBoxObjs].obj.position.set(
                        objectPosition2.x,
                        objectPosition2.y,
                        objectPosition2.z
                      );
                    }
                  }
                }
              } else {
                //HIDE DRIVE HOTSPOT
                //drivehotspotsQueue
                var index = drivehotspotsQueue.indexOf(objIndex);
                if (index > -1) {
                  drivehotspotsQueue.splice(index, 1);
                }
                //bring to up hotspot on the top of the queue
                if (drivehotspotsQueue.length > 0) {
                  var indtoup = drivehotspotsQueue[0];
                  var sphericalPoint = new THREE.Spherical();
                  sphericalPoint.setFromCartesianCoords(
                    boxobjs[indtoup].x,
                    boxobjs[indtoup].y,
                    boxobjs[indtoup].z
                  );
                  if (sphericalPoint.radius > 0) {
                    sphericalPoint.radius = sphericalPoint.radius - 50;
                  } else {
                    sphericalPoint.radius = sphericalPoint.radius + 50;
                  }
                  //sphericalPoint.radius = videoSphereRadius-10;
                  sphericalPoint.makeSafe();
                  var objectPosition2 = new THREE.Vector3();
                  objectPosition2.setFromSpherical(sphericalPoint);

                  if (boxobjs[indtoup].obj.length > 1) {
                    boxobjs[indtoup].obj[0].position.set(
                      objectPosition2.x,
                      objectPosition2.y,
                      objectPosition2.z
                    );
                  } else {
                    boxobjs[indtoup].obj.position.set(
                      objectPosition2.x,
                      objectPosition2.y,
                      objectPosition2.z
                    );
                  }
                }
              }
            }
          }
          playerEventEngineWork.terminate();
          playerEventEngineWork = undefined;
          break;
        default:
          break;
      }
    };
  } else {
    console.log("No Web Worker support.");
  }
}

/*
id : id utente nostro login preso dalla uri
dataObjSaved : oggetto salvato nell html dei vari oggetti della scena
video: variabile globale con i metadata dei video
eventType: stringa può essere click fov o playback a seconda dell'evento chiamante stampato a codice
*/
function requestSemanticEngine(id, dataObjSaved, video, eventType) {
  console.log(
    "Semanticengine \n" +
      domain +
      "/H360/partnerService/getSessionInfo" +
      "?id=" +
      id
  );
  if (dataObjSaved.length > 0) {
    $.ajax({
      type: "GET",
      url: domain + "/H360/partnerService/getSessionInfo" + "?id=" + id,
      dataType: "json",
      success: function (data) {
        console.log(data); //data.message.session e .uid
        $.ajax({
          type: "GET",
          url:
            domain +
            "/H360/video/getTopic" +
            "?resourceName=" +
            dataObjSaved[0].resourceName +
            "&group=" +
            group,
          dataType: "json",
          success: function (dataTopic) {
            console.log(dataTopic);
            if (!dataTopic || dataTopic === {} || dataTopic === "undefined") {
              dataTopic = {};
              dataTopic.message = "music festival";
            }
            var starttime =
              eventType === "fov"
                ? dataObjSaved[0].fovStart * 1000
                : video.currentTime * 1000;
            var endtime =
              eventType === "fov"
                ? dataObjSaved[0].fovStop * 1000
                : video.currentTime * 1000;
            var duration = video.duration * 1000;
            starttime = Math.trunc(starttime);
            endtime = Math.trunc(endtime);
            duration = Math.trunc(duration);
            console.log(typeof starttime.toString());
            console.log(typeof endtime.toString());
            console.log(starttime + "\n" + endtime + "\n" + duration);
            //console.log("theta (azimut) " + controls.getAzimuthalAngle());
            //console.log("phi" + controls.getPolarAngle());

            //console.log("theta (azimut) " + Math.round(1000*(controls.getAzimuthalAngle())*180/Math.PI)/1000); //tre cifre dopo la virgola
            //console.log("phi " + Math.round(1000*(controls.getPolarAngle())*180/Math.PI)/1000);
            var param = {
              uid: data.message.uid,
              sid: data.message.session,
              type: eventType,
              theta:
                Math.round((1000 * controls.getPolarAngle() * 180) / Math.PI) /
                  1000 -
                90, //gradi con tre cifre dopo la virgola
              phi:
                Math.round(
                  (1000 * controls.getAzimuthalAngle() * 180) / Math.PI
                ) / 1000, //gradi con tre cifre dopo la virgola
              video:
                dataObjSaved[0].resourceName + "_" + dataObjSaved[0].processId,
              videoMetadata: {
                name: dataObjSaved[0].resourceName,
                duration: duration,
                configuration_name: dataObjSaved[0].processId,
                topic: dataTopic.message,
              },
              startTime: starttime.toString(),
              endTime: endtime.toString(),
            };
            param.objects = [];
            for (var i = 0; i < dataObjSaved.length; i++) {
              var tags = [];
              if (dataObjSaved[i].properties.tags) {
                for (
                  var j = 0;
                  j < dataObjSaved[i].properties.tags.length;
                  j++
                ) {
                  tags.push(dataObjSaved[i].properties.tags[j].name);
                }
              }
              var obj = {
                object: dataObjSaved[i].objIdentifier,
                objectMetadata: {
                  type:
                    dataObjSaved[i].shape === false
                      ? dataObjSaved[i].shape
                      : "video2d",
                  name: dataObjSaved[i].name,
                  tags: tags.length !== 0 ? tags : ["H360"],
                  //"tags":tags
                },
              };
              // param.objects=Object.assign(obj);
              param.objects.push(obj);
            }
            console.log(JSON.stringify(param));
            $.ajax({
              type: "POST",
              url: domain + "/H360/partnerService/transaction",
              data: param,
              dataType: "json",
              success: function (data1) {
                console.log(data1);
              },
            });
          },
        });
      },
    });
  }
}

//config managing
function configEngine(initialPlaystatus) {
  console.log("[configEngine]:controlsparam", controlsparam);
  //var initialPlaystatus=false;//gestisce lo stato iniziale del taso play (create per autoplay jump)
  if (typeof controlsparam !== "undefined") {
    if (controlsparam === "true") {
      var embtimediv = document.getElementById("embtimediv");
      if (!embtimediv) {
        var arrayTemp = makeControlsBar(
          "video-controls",
          initialPlaystatus,
          function (target) {
            controlsBarEventManage(
              target,
              videoControl,
              playbuttonbar,
              mutebuttonbar,
              function (newplaybuttonbar, newmutebuttonbar) {
                playbuttonbar = newplaybuttonbar;
                mutebuttonbar = newmutebuttonbar;
              }
            );
          }
        ); //[0] = refer to button play/pause
        playButtonOnControlsBarRef = arrayTemp[0];
        stopButtonOnControlsBarRef = arrayTemp[1];
      }
    }
  }
}

function loadConfigurationStored(updateData) {
  //parametro  serve ad abilitare o meno l'aggiornamento del dato o fare solo la chiamata fake
  if (url.length) {
    audioElement = [];
    var stopElementIndex = 0;
    // Load scene configuration (hotspots, 3D objects, and so on)
    $.ajax({
      type: "GET",
      url: url.replace(/&amp;/g, "&"),
      dataType: "json",
      success: function (data) {
        // console.log("DATI SCARICATI : \n")
        // console.log(JSON.stringify(data))
        if (typeof recomCheck !== "undefined") {
          if (recomCheck === "true") {
            loadConfigurationWeight(data.message, updateData); //poi chiami funzione FUSCHILLIANA all'interno
          } else {
            //FUNZIONE FUSCHILLIANA SENZA PARAMETRI RECOM ;
            dataProcessing(data);
          }
        } else {
          dataProcessing(data);
        }
      },
    });
  }
}

function dataProcessing(data) {
  checkOptionsPlay(function (err, info) {
    //the data setup will be start after checkOptions for autoplay
    if (data.message[0]) {
      var items = [];
      //console.log(data);
      data.message = data.message[0].elements;
      // Pre-load each THREE.js object
      var loader = new THREE.ObjectLoader();
      for (var i = 0; i < data.message.length; i++) {
        if (data.message[i].shapeobj && data.message[i].category === "shape") {
          //shape
          var loader = new THREE.ObjectLoader();

          if (data.message[i].recomWeight) {
            data.message[i].shapeobj.materials[0].opacity = Number(
              getAlphaValue(
                data.message[i].shapeobj.materials[0].opacity,
                data.message[i].recomWeight
              )
            );
          }
          data.message[i].obj = loader.parse(data.message[i].shapeobj);
        } else if (data.message[i].category === "text") {
          //TEXT | HTML
          var cssObj = useCreateCssObjectSceneText(
            data.message[i].properties,
            data.message[i]
          );
          data.message[i].obj = cssObj;
          data.message[i].obj[0].position.set(
            data.message[i].x,
            data.message[i].y,
            data.message[i].z
          );
          data.message[i].obj[0].name = data.message[i].objIdentifier;
        } else if (data.message[i].category === "textline") {
          //TEXTLINE
          var cssObj = textlineBeahaviourOnTopFromProperties(
            data.message[i].properties,
            data.message[i]
          );
          data.message[i].obj = cssObj;
        } else if (data.message[i].category === "htmlpage") {
          // console.log (data.message[i]) ;
          var cssObj = {};
          if (data.message[i].properties.cover === true) {
            cssObj = makingCSSObjectWithHTMLpage(
              data.message[i].properties,
              {
                x: data.message[i].x,
                y: data.message[i].y,
                z: data.message[i].z,
              },
              data.message[i].recomWeight
            );
          } else {
            cssObj = makingCSSObjectWithHTMLpage(data.message[i].properties, {
              x: data.message[i].x,
              y: data.message[i].y,
              z: data.message[i].z,
            });
          }
          data.message[i].obj = cssObj;
          data.message[i].obj[0].position.set(
            data.message[i].x,
            data.message[i].y,
            data.message[i].z
          );
          data.message[i].obj[0].name = data.message[i].objIdentifier;
        } else if (data.message[i].category === "image") {
          var cssObj = useCreateCssObjectSceneImage(
            data.message[i].properties,
            data.message[i]
          );
          data.message[i].obj = cssObj;
          data.message[i].obj[0].position.set(
            data.message[i].x,
            data.message[i].y,
            data.message[i].z
          );
          data.message[i].obj[0].name = data.message[i].objIdentifier;
        } else if (data.message[i].category === "metadata") {
          var cssObj = useCreateCssObjectSceneImage(
            data.message[i].properties,
            data.message[i]
          );
          data.message[i].obj = cssObj;
          data.message[i].obj[0].position.set(
            data.message[i].x,
            data.message[i].y,
            data.message[i].z
          );
          data.message[i].obj[0].name = data.message[i].objIdentifier;
        } else if (data.message[i].category === "audio") {
          if (camera === undefined) {
            camera = new THREE.PerspectiveCamera(
              75,
              window.innerWidth / window.innerHeight,
              0.1,
              1000
            );
          }

          //https://threejs.org/docs/#api/en/audio/PositionalAudio
          var cssObj = useCreateAudioObjectScene(
            data.message[i].properties,
            camera,
            data.message[i],
            function (target) {
              if (target.id === "audio") {
                //console.log(target.mediaElement);
                var checkPositional = false;
                if (typeof target.properties.positional !== "undefined") {
                  if (target.properties.positional.active === true) {
                    checkPositional = true;
                    target.mediaElement.onended = function () {
                      //console.log('sound1 ended #1');
                    };
                    //console.log(target.mediaElement.isPlaying);
                    if (target.mediaElement.isPlaying === false) {
                      // console.log("target " + JSON.stringify(target));
                      stopOtherAudio(target.myIndexArray);
                      var dataObjSaved = JSON.parse(target.data);
                      if (id) {
                        requestSemanticEngine(
                          id,
                          [dataObjSaved],
                          video,
                          "playback"
                        );
                      }
                      target.mediaElement.play();
                      if (target.children[0]) {
                        target.children[0].className =
                          "big pause circle fitted icon";
                      }
                    } else {
                      target.mediaElement.pause();
                      if (target.children[0]) {
                        target.children[0].className =
                          "big play circle fitted icon";
                      }
                    }
                  }
                }
                if (!checkPositional) {
                  //console.log(target.mediaElement)
                  if (target.mediaElement.readyState === 4) {
                    //4 - HAVE_ENOUGH_DATA
                    if (target.mediaElement.paused) {
                      // console.log("target " + JSON.stringify(target));
                      stopOtherAudio(target.myIndexArray);
                      var dataObjSaved = JSON.parse(target.data);
                      if (id) {
                        requestSemanticEngine(
                          id,
                          [dataObjSaved],
                          video,
                          "playback"
                        );
                      }
                      target.mediaElement.play();
                      if (target.children[0]) {
                        target.children[0].className =
                          "big pause circle fitted icon";
                      }
                    } else {
                      target.mediaElement.pause();
                      if (target.children[0]) {
                        target.children[0].className =
                          "big play circle fitted icon";
                      }
                    }
                  }
                }
              }
            }
          );
          //cssObj[0] = CSSOBJECT - cssObj[1] = html tag - cssObj[2] = mediaElement
          data.message[i].obj = cssObj;
          data.message[i].obj[0].position.set(
            data.message[i].x,
            data.message[i].y,
            data.message[i].z
          );
          data.message[i].obj[0].name = data.message[i].objIdentifier;
        } else if (data.message[i].category === "video2d") {
          //video2d
          if (
            data.message[i].properties.mentor === true &&
            data.message[i].properties.mentorsnippet === false
          ) {
            var cssObj = makeVideoCssObjEdit(data.message[i].properties);
            data.message[i].obj = cssObj;
            data.message[i].obj[0].position.set(0, 0, 0);
            data.message[i].obj[0].name = data.message[i].objIdentifier;
          } else {
            var iscovervideo2d = false;
            if (typeof data.message[i].properties.cover !== "undefined") {
              if (Boolean(data.message[i].properties.cover) === true) {
                iscovervideo2d = true;
              }
            }
            if (!iscovervideo2d) {
              var infoObjVideo2d = makeVideoCssObj(data.message[i].properties);
              //var infoObjVideo2d = makeTextureVideo2d(data.message[i].properties);
              if (infoObjVideo2d.length == 2) {
                data.message[i].obj = infoObjVideo2d;
                data.message[i].obj[0].position.set(
                  data.message[i].x,
                  data.message[i].y,
                  data.message[i].z
                );
                data.message[i].obj[0].name = data.message[i].objIdentifier;
                data.message[i].videorefer = infoObjVideo2d[1];
                if (data.message[i].properties.stopback === true) {
                  data.message[i].videorefer.addEventListener(
                    "play",
                    playListenerVideo2D
                  );
                  data.message[i].videorefer.addEventListener(
                    "playing",
                    playListenerVideo2D
                  );
                  data.message[i].videorefer.addEventListener(
                    "pause",
                    pauseListenerVideo2D
                  );
                  data.message[i].videorefer.addEventListener(
                    "ended",
                    endedListenerVideo2D
                  );
                }
              }
              /*
               *	Setting for media command
               */
              /*var comW=data.message[i].obj.geometry.parameters.width;
					var verticesNumber = data.message[i].obj.geometry.vertices.length-1;
					var mediaCommandGroup = makeMediaControls(comW,data.message[i].obj.geometry.vertices[0].x,data.message[i].obj.geometry.vertices[verticesNumber].y);
					//data.message[i].obj.add(mediaCommandGroup);
					data.message[i].obj.groupcommands = mediaCommandGroup;*/
            } else {
              var infoObjVideo2d = makeVideoCoverCssObj(
                data.message[i].properties,
                data.message[i]
              );
              if (infoObjVideo2d.length == 2) {
                data.message[i].obj = infoObjVideo2d;
                data.message[i].obj[0].position.set(
                  data.message[i].x,
                  data.message[i].y,
                  data.message[i].z
                );
                data.message[i].obj[0].name = data.message[i].objIdentifier;
              }
            }
          }
        }
        stopElementIndex = boxobjs.push(data.message[i]);
        if (data.message[i].category === "audio") {
          audioElement.push(stopElementIndex - 1);
        }
        var newobj = {
          key: data.message[i]._id,
          description: data.message[i].description,
          link: data.message[i].link,
          meta: data.message[i].starttime + " - " + data.message[i].stoptime,
          header: data.message[i].category,
          category: data.message[i].category,
          tEnd: data.message[i].tEnd,
          tStart: data.message[i].tStart,
          objIdentifier: data.message[i].objIdentifier,
          name: data.message[i].name,
          fulltime: data.message[i].fulltime,
        };
        items.push(newobj);
      }
      sendMessage({
        type: "configitems",
        items: items,
      });

      init();
      animate();
      fovRecommanderSetup();
      if (boxobjs.length > 0) {
        if (boxobjs[0].videoundertakeoptions) {
          if (boxobjs[0].videoundertakeoptions.videoundertake === true) {
            if (boxobjs[0].videoundertakeoptions.type === "loop") {
              loopOption = true;
            }
          }
        } else {
          //no videoundertakeoptions set - old data
          loopOption = true; //default behaviour
        }
      } else {
        loopOption = true; //default behaviour
      }
      video.loop = loopOption;
      settingRecomLoopRequest();
    } else {
      init();
      animate();
    }
  }); //video master
}

/*
 *Modifying boxobjs to include weight from recommandation
 *
 */
function assigningWeightFromRecommandation(objectsInput, objectsToModify) {
  for (var i = 0; i < objectsInput.message.body.message.length; i++) {
    var obj = objectsInput.message.body.message[i];
    var objIndex = objectsToModify.findIndex((x) => x._id === obj._id);
    if (objIndex !== -1) {
      objectsToModify[objIndex].recomWeight = obj.weight;
      //gestione alpha
      // var alpha = obj.weight * 1 ;
      // console.log(alpha)
      // if (alpha>=0.35  ){
      // objectsToModify[objIndex].alpha = alpha;
      // }else{
      // 	objectsToModify[objIndex].alpha = 0.35;
      // }
    }
  }
}

function stopOtherAudio(currentItem) {
  //console.log('current item ' + currentItem + audioElement)
  var elementShouldMuted;
  for (var i = 0; i < audioElement.length; i++) {
    if (audioElement[i] !== currentItem) {
      elementShouldMuted = boxobjs[audioElement[i]];
      var positional = false;

      if (typeof elementShouldMuted.properties.positional !== "undefined") {
        if (elementShouldMuted.properties.positional.active === true) {
          positional = true;
          if (elementShouldMuted.obj[2].isPlaying === true) {
            elementShouldMuted.obj[2].pause();
            elementShouldMuted.obj[3].className = "big play circle fitted icon";
          }
        }
      }
      if (!elementShouldMuted.obj[2].paused && !positional) {
        elementShouldMuted.obj[2].pause();
        elementShouldMuted.obj[3].className = "big play circle fitted icon";
      }
    }
  }
}

function loadConfigurationWeight(dataObjSaved, updateData) {
  //upadte data serve ad abilitare o meno l'aggiornamento del dato o fare solo la chiamata fake
  dataObjSaved = dataObjSaved[0].elements;
  if (paramtotest === true) {
    // dati da levare sono mock
    console.log("loadConfigurationWeight caso di test ");
    console.log(dataObjSaved);
    assigningWeightFromRecommandation(result, dataObjSaved);
    dataProcessing({
      message: [
        {
          elements: dataObjSaved,
        },
      ],
    });
  } else {
    // dati da levare sono mock tutto il blocco if e le parentesti dell'else
    if (dataObjSaved.length > 0) {
      $.ajax({
        type: "GET",
        url: domain + "/H360/partnerService/getSessionInfo" + "?id=" + id,
        dataType: "json",
        success: function (data) {
          console.log(data); //data.message.session e .uid
          $.ajax({
            type: "GET",
            url:
              domain +
              "/H360/video/getTopic" +
              "?resourceName=" +
              dataObjSaved[0].resourceName +
              "&group=" +
              group,
            dataType: "json",
            success: function (dataTopic) {
              console.log(dataTopic);
              if (!dataTopic) {
                dataTopic.message = "music festival";
              }
              var time = "0";
              var endTime = video.duration * 1000;
              endTime = Math.trunc(endTime);
              var param = {
                subsystem: "WEB_PLAYER",
                uid: data.message.uid,
                tid: data.message.session,
                resourceName:
                  dataObjSaved[0].resourceName +
                  "_" +
                  dataObjSaved[0].processId,
                startTime: time,
                endTime: endTime + "",
                topic: dataTopic.message,
              };
              param.message = [];
              for (var i = 0; i < dataObjSaved.length; i++) {
                var tags = [];
                if (dataObjSaved[i].properties.tags) {
                  for (
                    var j = 0;
                    j < dataObjSaved[i].properties.tags.length;
                    j++
                  ) {
                    tags.push(dataObjSaved[i].properties.tags[j].name);
                  }
                }
                var obj = {
                  _id: dataObjSaved[i]._id,
                  description: dataObjSaved[i].description,
                  tags: tags.length !== 0 ? tags : ["H360"],
                };

                // param.objects=Object.assign(obj);
                param.message.push(obj);
              }
              console.log(JSON.stringify(param));
              $.ajax({
                type: "POST",
                url: domain + "/H360/partnerService/recom",
                data: param,
                dataType: "json",
                success: function (result) {
                  console.log("Recom Response: \n");
                  console.log(result);
                  console.log(result.message.statusCode);
                  // if (updateData){
                  if (result.message.statusCode === 200) {
                    //FUNZIONE FUSCHILLIANA CON  PARAMETRI RECOM ;
                    if (updateData) {
                      assigningWeightFromRecommandation(result, dataObjSaved);
                      dataProcessing({
                        message: [
                          {
                            elements: dataObjSaved,
                          },
                        ],
                      });
                    } else {
                      //recomCheck and recomandation da mettere a false
                      recomCheck = false;
                      recommendation = false;
                      // window.alert("Sorry! The recommendation service is not available")
                      dataProcessing({
                        message: [
                          {
                            elements: dataObjSaved,
                          },
                        ],
                      });
                    }
                  } else {
                    //recomCheck and recomandation da mettere a false
                    recomCheck = false;
                    recommendation = false;
                    // window.alert("Sorry! The recommendation service is not available")
                    dataProcessing({
                      message: [
                        {
                          elements: dataObjSaved,
                        },
                      ],
                    });
                  }
                },
                error: function (xhr) {
                  console.log("error", xhr);
                  dataProcessing({
                    message: [
                      {
                        elements: dataObjSaved,
                      },
                    ],
                  });
                },
              });
            },
          });
        },
      });
    }
  }
}

function endVideoEvent() {
  if (boxobjs.length > 0) {
    if (boxobjs[0].videoundertakeoptions) {
      if (boxobjs[0].videoundertakeoptions.videoundertake === true) {
        if (boxobjs[0].videoundertakeoptions.type === "jump") {
          if (!boxobjs[0].videoundertakeoptions.actionOptions) {
            window.location.href =
              domain +
              "/H360/use?processId=" +
              boxobjs[0].videoundertakeoptions.idConfig +
              "&resourceName=" +
              boxobjs[0].videoundertakeoptions.idVideo +
              "&controls=true&postmsg=false&seek=" +
              boxobjs[0].videoundertakeoptions.tStart +
              "&autoplay=true" +
              "&group=" +
              group +
              "&recommendation=" +
              recommendation.toString() +
              "&recomCheck=" +
              recomCheck.toString() +
              "&id=" +
              id;
          } else {
            if (
              boxobjs[0].videoundertakeoptions.actionOptions.initialDegree ===
                "defaultview" ||
              boxobjs[0].videoundertakeoptions.actionOptions.initialDegree ===
                "" ||
              !boxobjs[0].videoundertakeoptions.actionOptions.initialDegree
            ) {
              let path =
                domain +
                "/H360/use?processId=" +
                boxobjs[0].videoundertakeoptions.idConfig +
                "&resourceName=" +
                boxobjs[0].videoundertakeoptions.idVideo +
                "&controls=true&postmsg=false&seek=" +
                boxobjs[0].videoundertakeoptions.tStart +
                "&group=" +
                group +
                "&autoplay=true" +
                "&recommendation=" +
                recommendation.toString() +
                "&recomCheck=" +
                recomCheck.toString() +
                "&id=" +
                id;

                if ( typeof  boxobjs[0].videoundertakeoptions.actionOptions.synchronized !== 'undefined' ){
                  if (boxobjs[0].videoundertakeoptions.actionOptions.synchronized){
                    path=path+"&time="+video.currentTime;
                  }
                }
                window.location.href=path;
            } else if (
              boxobjs[0].videoundertakeoptions.actionOptions.initialDegree ===
              "takeoff"
            ) {
              let path =
                domain +
                "/H360/use?processId=" +
                boxobjs[0].videoundertakeoptions.idConfig +
                "&resourceName=" +
                boxobjs[0].videoundertakeoptions.idVideo +
                "&controls=true&postmsg=false&seek=" +
                boxobjs[0].videoundertakeoptions.tStart +
                "&group=" +
                group +
                "&autoplay=true" +
                "&initialDegreeX=" +
                camera.position.x +
                "&initialDegreeY=" +
                camera.position.y +
                "&initialDegreeZ=" +
                camera.position.z +
                "&recommendation=" +
                recommendation.toString() +
                "&recomCheck=" +
                recomCheck.toString() +
                "&id=" +
                id;
                if ( typeof  boxobjs[0].videoundertakeoptions.actionOptions.synchronized !== 'undefined' ){
                  if (boxobjs[0].videoundertakeoptions.actionOptions.synchronized){
                    path=path+"&time="+video.currentTime;
                  }
                }
                window.location.href=path;
            }
          }
        } else if (boxobjs[0].videoundertakeoptions.type === "stop") {
          controlsBarEventManage(
            stopButtonOnControlsBarRef,
            videoControl,
            true,
            false,
            mutebuttonbar,
            function (newplaybuttonbar, newmutebuttonbar) {
              playbuttonbar = newplaybuttonbar;
              mutebuttonbar = newmutebuttonbar;
            }
          );
          /*video.currentTime = 0.0;
					progressBar.value = 0.0;
					video.pause();*/
        }
      }
    } else {
      //no videoundertakeoptions set - old data
      loopOption = true; //default behaviour
    }
  }
}

function fovRecommanderSetup() {
  /*recommandation engine: MUST BE POSITIONED AFTER CAMERA SETTINGS
   * If "recommendation" query param is not defined
   */
  //console.log(recommendation);
  var fovObjsOLD = []; //index array containing objects in FOV
  if (typeof recommendation !== "undefined") {
    if (recommendation === "true") {
      setInterval(function () {
        //web work instance
        if (typeof Worker !== "undefined") {
          if (typeof playerRecommEngineWork === "undefined") {
            playerRecommEngineWork = new Worker(recomwork);
          }
          playerRecommEngineWork.postMessage({
            boxobjs: JSON.parse(JSON.stringify(boxobjs)),
            currentTime: video.currentTime,
            projectionMatrix: camera.projectionMatrix,
            matrixWorldInverse: camera.matrixWorldInverse,
          });
          playerRecommEngineWork.onmessage = function (event) {
            playerRecommEngineWork.terminate();
            playerRecommEngineWork = undefined;
            //array with object id in FOV
            if (event.data.item.length) {
              var fovobjs = [];
              var objindexinfov = [];
              for (var i = 0; i < event.data.item.length; i++) {
                var indexOLD = fovObjsOLD.indexOf(event.data.item[i]);
                if (indexOLD !== -1) {
                  //found (shows itself twice) the object has been seen
                  boxobjs[event.data.item[i]].fovStop = video.currentTime;
                  //insert only objects that remain in FOV after time
                  fovobjs.push(boxobjs[event.data.item[i]]);
                  //console.log(boxobjs[event.data.item[i]].name);
                  fovObjsOLD.splice(indexOLD, 1);
                  console.log("STOP FOV: " + video.currentTime);
                } else {
                  //not found
                  console.log("INIT FOV: " + video.currentTime);
                  boxobjs[event.data.item[i]].fovStart = video.currentTime;
                  fovObjsOLD.push(event.data.item[i]);
                }
                //console.log(fovObjsOLD.indexOf(event.data.item[i]));
              }
              //fovObjsOLD = Array.from(objindexinfov); //save objects indexed in FOV
              //Object.assign({}, obj);
              //var obj=boxobjs[0];
              //console.log(obj.category);
              console.log(fovobjs.length + "ID: " + id);
              if (id && fovobjs.length > 0) {
                console.log("CALL FOV: " + video.currentTime);
                //console.log("OGGETT INVIATI FOV: " + fovobjs.length);
                requestSemanticEngine(id, fovobjs, video, "fov");
              }
            } else {
              console.log("NO OBJECTS IN FOV");
              fovObjsOLD = [];
            }
          };
        }
      }, 5000);
    }
  }
}

function createLoader() {
  var backgroundDiv = document.createElement("div");
  backgroundDiv.id = "backdimmer";
  backgroundDiv.className = "ui active transition visible  dimmer";
  var loadingobj = document.createElement("div");
  loadingobj.className = "ui large loader";
  if (group.toUpperCase() === "RBB") {
    var imgTransition = document.createElement("img");
    imgTransition.style.width = "25%";
    imgTransition.style.height = "20%";
    //imgTransition.style.paddingLeft = '40%';
    //imgTransition.style.paddingRight = '40%';
    //imgTransition.style.paddingBottom = '15%';
    //imgTransition.style.paddingTop = '15%';
    imgTransition.style.marginTop = "20%";
    imgTransition.style.marginBottom = "20%";
    imgTransition.style.marginRight = "10%";
    imgTransition.style.marginLeft = "10%";
    imgTransition.className = "ui middle aligned tiny image";
    imgTransition.src =
      domain + "/resources/video/assets/RBB/player_image_rbb4.png";
    console.log(imgTransition.src);
    backgroundDiv.appendChild(imgTransition);
  }
  backgroundDiv.appendChild(loadingobj);
  loaderDiv.appendChild(backgroundDiv);
  container.appendChild(loaderDiv);
  $("#backdimmer").css("background-color", "rgba(187,187,187,1)");
}

/*function createLoader(){
	var div2= document.createElement('div')
	var div3= document.createElement('div')
	var div4= document.createElement('div')
	var img= document.createElement('img')
 	loaderDiv.className="ui ";
	 div2.className="ui active transition visible  dimmer";
	 div3.className="content  ";
	 div4.className="ui large loader";
	div3.appendChild(div4);
	div2.appendChild(div3)
	loaderDiv.appendChild(div2)
	container.appendChild(loaderDiv);
}*/

/** Michele Fuschillo - 09-09-2019
 * listener on tag html video into threejs 2d video
 * START
 */
function playListenerVideo2D(event) {
  console.log("video play");
  if (event.type === "play" || event.type === "playing") {
    //block video master
    controlsBarEventManage(
      playButtonOnControlsBarRef,
      videoControl,
      true,
      false,
      function (newplaybuttonbar, newmutebuttonbar) {
        playbuttonbar = newplaybuttonbar;
        mutebuttonbar = newmutebuttonbar;
      }
    );
  }
}

function pauseListenerVideo2D(event) {
  console.log("video pause");
  if (event.type === "pause") {
    //start video master
    controlsBarEventManage(
      playButtonOnControlsBarRef,
      videoControl,
      false,
      false,
      function (newplaybuttonbar, newmutebuttonbar) {
        playbuttonbar = newplaybuttonbar;
        mutebuttonbar = newmutebuttonbar;
      }
    );
  }
}

function endedListenerVideo2D(event) {
  console.log("video pause");
  //start video master
  controlsBarEventManage(
    playButtonOnControlsBarRef,
    videoControl,
    false,
    false,
    function (newplaybuttonbar, newmutebuttonbar) {
      playbuttonbar = newplaybuttonbar;
      mutebuttonbar = newmutebuttonbar;
    }
  );
}

/*
 * END
 **/

function setCameraDefaultPosition() {
  if (typeof initialDegreeX !== "undefined") {
    if (initialDegreeX) {
      camera.position.x = initialDegreeX;
    } else {
      camera.position.x = 90;
    } //valore di default preso in modo sperimentale
  } else {
    camera.position.x = 90;
  }
  if (typeof initialDegreeY !== "undefined") {
    if (initialDegreeY) {
      camera.position.y = initialDegreeY;
    } else {
      camera.position.y = 5.5194085358;
    } //valore di default preso in modo  sperimentale
  } else {
    camera.position.y = 5.5194085358;
  }
  if (typeof initialDegreeZ !== "undefined") {
    if (initialDegreeZ) {
      camera.position.z = initialDegreeZ;
    } else {
      camera.position.z = 5.000000000000009;
    } //valore di default preso in modo  sperimentale
  } else {
    camera.position.z = 5.000000000000009;
  }
}

function compassSetup() {
  if (compassStatus === "true") {
    imgCompass.src = domain + "/resources/video/assets/compass.png";
    imgCompass.style.width = "50px";
    imgCompass.style.height = "50px";
    imgCompass.style.display = "block";
    imgCompass.style.objectFit = "contain";
    imgCompass.style.zIndex = "2";
    imgCompass.id = "compass";
    switch (compassPosition) {
      case "BottomSX":
        imgCompass.style.marginBottom = "-25px";
        imgCompass.classList.add("uieOverlayLogoBottomLeft");
        break;
      case "BottomDX":
        imgCompass.style.marginRight = "-10px";
        imgCompass.style.marginBottom = "-25px";
        imgCompass.classList.add("uieOverlayLogoBottomRight");
        break;
      case "TopSX":
        imgCompass.classList.add("uieOverlayLogoTopLeft");

        break;
      case "TopDX":
        imgCompass.classList.add("uieOverlayLogoTopRight");

        break;
      default:
    }
    container.appendChild(imgCompass);
  }
}

window.onload = function () {
  document.body.classList.add("fade");
  createLoader();
  if (url.length) {
    createVideo();
  } else {
    //without hotspot
    createVideo();
    init();
    animate();
    fullscreen();
  }
  compassSetup();
};
