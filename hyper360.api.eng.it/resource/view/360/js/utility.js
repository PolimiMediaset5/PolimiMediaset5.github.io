var mongoObjectId = function () {
  var timestamp = (new Date().getTime() / 1000 | 0).toString(16)
  return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
    return (Math.random() * 16 | 0).toString(16)
  }).toLowerCase()
}

function makeControlsBar (htmlanchor, initialPlaystatus, callback) {
  var div = document.createElement('div')
  div.id = 'controlsbar'
  div.style.position = 'absolute'
  //div.style.bottom = '30px'
  div.style.bottom = '0px'
  div.style.right = 0
  div.style.left = 0
  div.style.textAlign = 'left'
  div.style.width = '100%'
  //div.style.border = "1px solid #73AD21";
  div.style.background = 'rgba(15,19,26,1)'
  div.style.color = 'blue'
  //div.innerHTML = "Hello";
  document.getElementById(htmlanchor).appendChild(div)

  /*
  * backward
  * */
  var buttonbackward = document.createElement('button')
  buttonbackward.className = 'small    ui  icon  button'
  buttonbackward.style.backgroundColor='rgba(15,19,26,1)'
  buttonbackward.style.color='rgba(255,255,255,1)'
  buttonbackward.id = 'backward'
  var iconbackward = document.createElement('i')
  iconbackward.className = ' backward icon'
  iconbackward.id = 'backwardicon'
  buttonbackward.appendChild(iconbackward)
  buttonbackward.addEventListener('click', function () {callback(this)})
  div.appendChild(buttonbackward)

  /*
  * STOP
  * */
  var buttonstop = document.createElement('button')
  buttonstop.className = 'small  ui  icon  button'
  buttonstop.id = 'stop'
  buttonstop.style.backgroundColor='rgba(15,19,26,1)'
  buttonstop.style.color='rgba(255,255,255,1)'
  var iconstop = document.createElement('i')
  iconstop.className = ' stop  icon'
  iconstop.id = 'stopicon'
  buttonstop.appendChild(iconstop)
  buttonstop.addEventListener('click', function () {callback(this)})
  // div.appendChild(buttonstop)
  /*
  * Play/Pause
  * */
  var button = document.createElement('button')
  button.className = 'small  ui  icon  button'
  button.id = 'play'
  button.style.backgroundColor='rgba(15,19,26,1)'
  button.style.color='rgba(255,255,255,1)'
  var icon = document.createElement('i')
  if(typeof(initialPlaystatus) !== "undefined") {
  if (!initialPlaystatus){
  icon.className = ' play  icon'
  playbuttonbar = false
  }else {
    icon.className = ' pause  fitted icon'
    playbuttonbar = true
  }
  }else{
    icon.className = ' play  icon'
playbuttonbar = false
  }
  icon.id = 'playicon'
  button.appendChild(icon)
  button.addEventListener('click', function () {callback(this)})
  div.appendChild(button)


  

  /*
 * forward
 * */
  var buttonforward = document.createElement('button')
  buttonforward.className = 'small  ui  black icon  button'
  buttonforward.id = 'forward'
  buttonforward.style.backgroundColor='rgba(15,19,26,1)'
  buttonforward.style.color='rgba(255,255,255,1)'
  var iconforward = document.createElement('i')
  iconforward.className = 'forward icon'
  iconforward.id = 'forwardicon'
  buttonforward.appendChild(iconforward)
  buttonforward.addEventListener('click', function () {callback(this)})
  div.appendChild(buttonforward)

  // var icontime = document.createElement('i')
  // icontime.className = 'large time  icon'
  // icontime.id = 'icontime'
  // div.appendChild(icontime)
  var embtimediv = document.createElement('i')
  embtimediv.className = 'iduration'
  embtimediv.id = 'embtimediv'
  div.appendChild(embtimediv)

  /*
 * Mute/unmute
 * */
var buttonmute = document.createElement('button')
buttonmute.className = 'small  ui  icon  button'
buttonmute.id = 'mute'
buttonmute.style.backgroundColor='rgba(15,19,26,1)'
buttonmute.style.color='rgba(255,255,255,1)'
var iconmute = document.createElement('i')
iconmute.className = ' volume up  icon'
iconmute.id = 'muteicon'
buttonmute.appendChild(iconmute)
buttonmute.addEventListener('click', function () {callback(this)})
div.appendChild(buttonmute)
mutebuttonbar = false

/*
 * fullscreen
 * */
  if (document.fullscreenEnabled) {
  var buttonfullscreen = document.createElement('button')
  buttonfullscreen.className = 'small  ui  black icon  button'
  buttonfullscreen.id = 'fullscreen'
  buttonfullscreen.style.float= 'right';
  buttonfullscreen.style.backgroundColor='rgba(15,19,26,1)'
  buttonfullscreen.style.color='rgba(255,255,255,1)'
  var iconfullscreen = document.createElement('i')
  iconfullscreen.className = 'expand icon'
  iconfullscreen.id = 'fullscreenicon'
  buttonfullscreen.appendChild(iconfullscreen)
  buttonfullscreen.addEventListener('click', function () {callback(this)})
  div.appendChild(buttonfullscreen)
  }


  /*
  * backward - forward velocity
  * */
  var velocityLabel = document.createElement('a')
  velocityLabel.className = 'ui small label black     '

  velocityLabel.id = 'velocity'
  velocityLabel.style.display = 'none'
  div.appendChild(velocityLabel);

  /**
   *  Only for edit modality - show fulscreen
   *  'mediavideoh360' is inserted only in use.pug
   */
  if(document.getElementById('mediavideoh360') === null){
    var buttonPlayMode = document.createElement('button');
    buttonPlayMode.className = 'small  ui  black icon  button';
    buttonPlayMode.id = 'gotoplaymode';
    buttonPlayMode.style.float= 'right';
    buttonPlayMode.style.backgroundColor='rgba(15,19,26,1)';
    buttonPlayMode.style.color='rgba(255,255,255,1)';
    var iconPlayMode = document.createElement('i');
    iconPlayMode.className = 'desktop icon';
    iconPlayMode.id = 'gotoplaymodeicon';
    buttonPlayMode.appendChild(iconPlayMode);
    buttonPlayMode.addEventListener('click', function () {callback(this)});
    div.appendChild(buttonPlayMode);
    $('#gotoplaymode')
    .popup({
      position : 'right center',
      target   : '#gotoplaymode',
      title    : 'Preview',
      content  : '',
    })
  }
  return [button, buttonstop];
}

/*
* target,videoControl,playbuttonbar,mutebuttonbar
 */
function controlsBarEventManage (target, videoControl, playbuttonbar, mutebuttonbar, callback) {
  if(target){
    switch (target.id) {
      case 'play':
      case 'playicon':
        clearFFREW('all')
        if (playbuttonbar === true) {
          videoControl.pauseVideo()
          playbuttonbar = false
          if (target.children[0]) {
            target.children[0].className = ' play  icon'
          } else {
            target.className = ' play  icon'
          }
        } else {
          videoControl.playVideo()
          playbuttonbar = true
          if (target.children[0]) {
            target.children[0].className = ' pause  icon'
          } else {
            target.className = ' pause  icon'
          }
        }
        callback(playbuttonbar, mutebuttonbar)
        break
      case 'stop':
      case 'stopicon':
  
        clearFFREW('all')
        playbuttonbar = false
        var icon = document.getElementById('playicon')
        icon.className = ' play  icon'
        //cleaningEngine();
        callback(playbuttonbar, mutebuttonbar)
        videoControl.stopVideo()
        break
      case 'backward':
      case 'backwardicon':
        clearFFREW('ff')
        var velLabel = document.getElementById('velocity')
        var icon = document.getElementById('playicon')
        icon.className = ' play  icon'
        playbuttonbar = false
  
        var velocityValue = videoControl.mediaBackward()
        velLabel.style.display = 'inline'
        switch (velocityValue.toString()) {
          case '600':
            velLabel.innerHTML = '2X'
            break
          case '400':
            velLabel.innerHTML = '4X'
            break
          case '200':
            velLabel.innerHTML = '6X'
            break
        }
        /*cleaningEngine('', function (err,result) {
          if(result){
  
          }
        });*/
        callback(playbuttonbar, mutebuttonbar)
        break
      case 'forward':
      case 'forwardicon':
        clearFFREW('rew')
        var velLabel = document.getElementById('velocity')
        var icon = document.getElementById('playicon')
        icon.className = ' play  icon'
        playbuttonbar = false
        var velocityValue = videoControl.mediaForward()
        velLabel.style.display = 'inline'
        switch (velocityValue.toString()) {
          case '600':
            velLabel.innerHTML = '2X'
            break
          case '400':
            velLabel.innerHTML = '4X'
            break
          case '200':
            velLabel.innerHTML = '6X'
            break
        }
        /*cleaningEngine('', function (err,result) {
          if(result){
  
          }
        });*/
        callback(playbuttonbar, mutebuttonbar)
        break
      case 'mute':
      case 'muteicon':
        if (mutebuttonbar == true) {
          videoControl.unmute()
          mutebuttonbar = false
          if (target.children[0]) {
            target.children[0].className = ' volume up  icon'
          } else {
            target.className = ' volume up  icon'
          }
        } else {
          videoControl.mute()
          mutebuttonbar = true
          if (target.children[0]) {
            target.children[0].className = ' volume off  icon'
          } else {
            target.className = ' volume off  icon'
          }
        }
        callback(playbuttonbar, mutebuttonbar)
        break
        case 'fullscreen':
          if (document.fullscreenEnabled) {
            // supported
            if (document.fullscreenElement) {
              // fullscreen is activated
              if (target.children[0]) {
                target.children[0].className = ' expand   icon'
              } else {
                target.className = ' expand   icon'
              }
              document.exitFullscreen();
              
          } else {
              // fullscreen is cancelled  // compress
              if (target.children[0]) {
                target.children[0].className = ' expand   icon'
              } else {
                target.className = ' expand   icon'
              }
              document.documentElement.requestFullscreen();
          }

            
        }else {
          console.log("FULLSCREEN NOT SUPPORTED")
        }
       
        callback(playbuttonbar, mutebuttonbar)
        break
       case 'gotoplaymode':
       case 'gotoplaymodeicon':  
       //play mode fullscreen button - start  19/05/20
       $("#modalfullscreen")
       .modal({
         centered: true,
         transition: "fade",
         onHidden: function () {
          
         }, 
         onShow: function () {
          $("#modalfullscreen").html(
            "<div style=width:100%;height:16px;margin-left:0px; margin-top:0px ><img style=width:16px;height:16px;margin-left:99%;margin-top:0px src=" +
            domain +
            "/resource/photo/x-mark-64.png" +
             " onClick=cancelPlayerModeFromModal(this)></div>"+
            "<div><img name=manualPlay src=" +
              domain +
              "/resource/photo/playImage.png" +
              " style=width:128px;height:128px;margin-left:43% onClick=startPlayerModeFromModal(this)></div><div style=text-align:center!important;font-size: 14px!important;line-height: 2!important;></br><h1>Switch on fullscreen</h1></br>Unsaved data will not be shown in the preview.<br/>Please save the current configuration if you want to see your latest changes</div>"
          );
         },
       })
       .modal("show");
       break
      default:
        break
    }
  }
}

/**
 *  play mode fullscreen button - start  19/05/2020
 */
function startPlayerModeFromModal() {
  if (boxobjs.length > 0) {
    var refObjCompassTemp = boxobjs[0].compass;
    if (refObjCompassTemp) {
      var playfullscreenurl =
        domain +
        "/H360/use?processId=" +
        processId +
        "&resourceName=" +
        resourceName;
      if (refObjCompassTemp.compassStatus === true) {
        playfullscreenurl =
          playfullscreenurl +
          "&controls=true&postmsg=false&autoplay=true&group=" +
          group +
          "&compassStatus=true&compassPosition=" +
          refObjCompassTemp.compassPosition;
      } else {
        playfullscreenurl =
          playfullscreenurl +
          "&controls=true&postmsg=false&autoplay=true&group=" +
          group +
          "&compassStatus=false";
      }
    } else {
      playfullscreenurl =
        playfullscreenurl +
        "&controls=true&postmsg=false&autoplay=true&group=" +
        group +
        "&compassStatus=false";
    }
    $("#modalfullscreen").modal('hide');
    window.open(playfullscreenurl, "_blank");
  }
}

function cancelPlayerModeFromModal(){
  $("#modalfullscreen").modal('hide');
}

/**
 *  play mode fullscreen button - end  19/05/2020
 */

function cleaningEngine (time, callback) {
  for (var key in eventTimeline) {
    for (var i = 0; i < eventTimeline[key].length; i++) {
      if (sceneObjects[eventTimeline[key][i]._id].videorefer) {
        sceneObjects[eventTimeline[key][i]._id].videorefer.pause()
        sceneObjects[eventTimeline[key][i]._id].videorefer.currentTime = 0
      }
      scene.remove(sceneObjects[eventTimeline[key][i]._id].threeJsObject)
      sendMessage({
        'type': 'currentelements',
        'action': 'hide',
        'item': eventTimeline[key][i]._id
      })
    }
  }
  if (callback) {
    callback(undefined, true)
  }

  if (typeof videogui != 'undefined') {
    videogui.close()
    videogui.destroy()
    videogui = undefined
  }

  if (cssScene) {
    for (var i = cssScene.children.length - 1; i >= 0; i--) {
      var obj = cssScene.children[i]
      cssScene.remove(obj)
    }
  }

  if (typeof objectHighLight != 'undefined' && scene.getObjectByName(objectHighLight.name)) {
    scene.remove(objectHighLight)
    objectHighLight = undefined
  }
}

//prende in input
// ff azzera i valori di fastforward
// rew Azzera i valori di rewind
// all azzera tutti e due i valori
function clearFFREW (chioice) {

  switch (chioice) {
    case 'all':
      var velLabel = document.getElementById('velocity')
      velLabel.style.display = 'none'
      break
    case 'ff':
      var velLabel = document.getElementById('velocity')
      velLabel.style.display = 'none'
      break
    case 'rew':
      var velLabel = document.getElementById('velocity')
      velLabel.style.display = 'none'
      break
  }

}

function clearAllScene () {
  for (var i = 0; i < boxobjs.length; i++) {
    var item = boxobjs[i]
    sendMessage({
      'type': 'currentelements',
      'action': 'hide',
      'item': item._id
    })
    if (item.category === 'text' || item.category === 'textline' || item.category === 'htmlpage' || item.category === 'image' || item.category === 'audio') {
      cssScene.remove(item.obj[0])

      if (item.category === 'audio') {
        item.obj[2].pause()
        item.obj[2].currentTime = 0.0
        item.obj[3].className = 'big play  fitted icon'
      }
    } else {
      scene.remove(item.obj)
      if (item.category === 'video2d') {
        if (item.videorefer && item.videorefer.currentTime > 0) {
          item.videorefer.pause()
          item.videorefer.currentTime = 0.0
        }
      }
    }
  }
}

function imageEngineClassNameFromProperties(properties){
//console.log("[imageEngineClassNameFromProperties]-Properties: ",properties);
  if (properties.vo.ontopoptionshor === 'left' && properties.vo.ontopoptionsver === 'top') {
    return 'uieOverlayLogoTopLeft';
  } else if (properties.vo.ontopoptionshor === 'right' && properties.vo.ontopoptionsver === 'top') {
    return 'uieOverlayLogoTopRight';
  } else if (properties.vo.ontopoptionshor === 'center' && properties.vo.ontopoptionsver === 'top') {
    return 'uieOverlayLogoTopCenter';
  } else if (properties.vo.ontopoptionshor === 'left' && properties.vo.ontopoptionsver === 'bottom') {
    return 'uieOverlayLogoBottomLeft';
  } else if (properties.vo.ontopoptionshor === 'right' && properties.vo.ontopoptionsver === 'bottom') {
    return 'uieOverlayLogoBottomRight';
  } else if (properties.vo.ontopoptionshor === 'center' && properties.vo.ontopoptionsver === 'bottom') {
    return 'uieOverlayLogoBottomCenter';
  } else if (properties.vo.ontopoptionshor === 'left' && properties.vo.ontopoptionsver === 'middle') {
    return 'uieOverlayLogoMiddleLeft';
  } else if (properties.vo.ontopoptionshor === 'right' && properties.vo.ontopoptionsver === 'middle') {
    return 'uieOverlayLogoMiddleRight';
  } else if (properties.vo.ontopoptionshor === 'center' && properties.vo.ontopoptionsver === 'middle') {
    return 'uieOverlayLogoMiddleCenter';
  }

  if (properties.vo.onscrollver === 'bottom'){
      return 'uieOverlayScrollTextBottom';
  }else{
      return 'uieOverlayScrollTextTop';
  }

  return '';
}

function getDelayLongClick(){
	return "500";
}

function getAWSUrl(group){
  if (group==='RTI'){
    	return "https://d2oy3sat9u3wfv.cloudfront.net/";
  }else if (group==='RBB'){
      return "https://dtcqpah7ktktm.cloudfront.net/"
  } else if (group==='RTI_HYPER360ASSESS'){
    return "https://dbdn4ptvzsvl9.cloudfront.net/";
  } else if (group==='RBB_HYPER360ASSESS'){
  return "https://d2blptinjv5r1m.cloudfront.net/";
 } 
}
