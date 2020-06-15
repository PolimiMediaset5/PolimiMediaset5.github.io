var THREEx	= THREEx	|| {};

THREEx.ChromaKeyMaterial = function (url, keyColor) {
  THREE.ShaderMaterial.call(this);

  var videoMentor = document.createElement('video');
  videoMentor.src = url;
  videoMentor.crossOrigin = 'anonymous';
  videoMentor.load();
  videoMentor.loop = true;

  var keyColorObject = new THREE.Color(keyColor);

  var videoTexture = new THREE.Texture(videoMentor);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;

  this.startVideo = function() {
    videoMentor.play();
  };

  this.stopVideo = function() {
    videoMentor.pause();
    videoMentor.src = "";
  };

  this.update = function () {
    if (videoMentor.readyState === videoMentor.HAVE_ENOUGH_DATA) {
      // videoImageContext.drawImage(video, 0, 0);
      if (videoTexture) {
        videoTexture.needsUpdate = true;
      }
    }
  };

  videoMentor.oncanplay = function () {
    videoMentor.play();
  }

  this.setValues({

    uniforms: {
      texture: {
        type: "t",
        value: videoTexture
      },
      color: {
        type: "c",
        value: keyColorObject
      }
    },
    vertexShader:
    "varying mediump vec2 vUv;\n" +
    "void main(void)\n" +
    "{\n" +
    "vUv = uv;\n" +
    "mediump vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n" +
    "gl_Position = projectionMatrix * mvPosition;\n" +
    "}",
    fragmentShader:
    "uniform mediump sampler2D texture;\n" +
    "uniform mediump vec3 color;\n" +
    "varying mediump vec2 vUv;\n" +
    "void main(void)\n" +
    "{\n" +
    "  mediump vec3 tColor = texture2D( texture, vUv ).rgb;\n" +
    "  mediump float a = (length(tColor - color) - 0.5) * 7.0;\n" +
    "  gl_FragColor = vec4(tColor, a);\n" +
    "}",
    transparent: true
  });
};

THREEx.ChromaKeyMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);
