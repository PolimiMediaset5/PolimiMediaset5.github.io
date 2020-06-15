/**
 * Create the main video sphere.
 *
 */

function createVideoSphere (radius, video) {
  var geometry = new THREE.SphereGeometry(radius, 100, 100);

  // invert the geometry on the x-axis so that all of the faces point inward
  geometry.scale(-1, 1, 1);

  var texture = new THREE.VideoTexture(video);
  texture.generateMipmaps = false; 
  texture.magFilter = THREE.LinearFilter; 
  texture.minFilter = THREE.LinearFilter;
  texture.format = THREE.RGBFormat;
  // 'THREE.ClampToEdgeWrapping' is the default texture UV wrapping
  var material = new THREE.MeshBasicMaterial({map: texture});
  // material.wireframe = true;

  var videoSphere = new THREE.Mesh(geometry, material);
  videoSphere.name = 'videoSphere';

  return videoSphere;
}


function createVideoSphereChromakey(radius, videopath, color) {
  if(videopath){
    var geometry = new THREE.SphereGeometry(radius, 100, 100);
    // invert the geometry on the x-axis so that all of the faces point inward
    geometry.scale(-1, 1, 1);
    //0xd432 is the green screen color, insert yours, if different, below
    var screenMaterial = new THREEx.ChromaKeyMaterial(videopath, color); 
    var screenVideoObject = new THREE.Mesh( geometry, screenMaterial);
    //screenVideoObject.rotation.y += Math.PI;
    return [screenVideoObject,screenMaterial];
  }else{
    return []; 
  }
}
/**
 * 
 * @param {*} mentorobj -> objectFocus
 * @param {*} videopath 
 * @param {*} color 
 */
function updateVideoSphereChromakey(mentorobj,props, color) {
  if(mentorobj && mentorobj.obj.length > 1){
    /**
     * we must be check if mentor is into scene
     */
      var sceneobj = makeVideoCssObjEdit(props);
      scene.remove(scene.getObjectByName(mentorobj.obj[0].name));
      if(sceneobj.length > 0){
        sceneobj[0].name = mentorobj.obj[0].name; //retrieve old unique identifier
        mentorobj.obj = sceneobj;
        mentorobj.inserted = true;
        scene.add(objectFocus.obj[0]); //0 = cssObject 1 = div associated to cssObject
        mentorobj.obj[0].lookAt(0, 0, 0);
        mentorobj.obj[0].position.set(0,0,0);
        //mentorobj.obj[1].startVideo();
        //mentorobj.obj[1].update(); 
      }
  }
}

function createPhotoSphere(radius, imagepath, callback) {
  // instantiate a loader
  var loader = new THREE.TextureLoader();
  // load a resource
  loader.load(
    // resource URL
    imagepath,

    // onLoad callback
    function (texture) {
      // in this example we create the material when the texture is loaded
      var material = new THREE.MeshBasicMaterial({ map: texture });
      var geometry = new THREE.SphereGeometry(radius, 100, 100);
      // invert the geometry on the x-axis so that all of the faces point inward
      geometry.scale(-1, 1, 1);
      var photosphere = new THREE.Mesh(geometry, material);
      photosphere.name = "videoSphere";
      if (container.contains(loaderDiv)) {
        container.removeChild(loaderDiv);
      }
      document.body.classList.remove("fade");
      callback(undefined, photosphere);
      return photosphere;
    },
    // onProgress callback currently not supported
    undefined,

    // onError callback
    function (err) {
      if (container.contains(loaderDiv)) {
        container.removeChild(loaderDiv);
      }
      document.body.classList.remove("fade");
      callback(err, undefined);
      console.error("An error happened."); 
    }
  );
  //return undefined;

  /*var texture = new THREE.TextureLoader().load( imagepath );
  var material = new THREE.MeshBasicMaterial( { map: texture } );
  var geometry = new THREE.SphereGeometry(radius, 100, 100);
  // invert the geometry on the x-axis so that all of the faces point inward
  geometry.scale(-1, 1, 1);
  var photosphere = new THREE.Mesh( geometry, material );
  photosphere.name = 'videoSphere';
  return photosphere;*/
}