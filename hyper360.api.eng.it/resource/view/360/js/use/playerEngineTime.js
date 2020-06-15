importScripts('https://cdnjs.cloudflare.com/ajax/libs/three.js/102/three.min.js'); // imports WinJS and story.js

function playerEngineTime(boxobjs, currentTime, projectionMatrix,matrixWorldInverse){
	var fovobj = [];
	for (var i = 0; i < boxobjs.length; i++) {
		var item = boxobjs[i];
		if (item.tStart >= 0 && item.tEnd > 0 && item.fulltime === false) { //new element has the fulltime option and will be without time control
			if (currentTime >= item.tStart && currentTime <= item.tEnd) {
				var frustum = new THREE.Frustum();
				frustum.setFromMatrix( new THREE.Matrix4().multiplyMatrices( projectionMatrix, matrixWorldInverse));
				var vector = new THREE.Vector3(item.x, item.y, item.z);
				if(frustum.containsPoint(vector)){
					fovobj.push(i);
				}
			} 
		}else if (item.fulltime == true) {//FULLTIME MANAGEMENT
			var frustum = new THREE.Frustum();
			frustum.setFromMatrix( new THREE.Matrix4().multiplyMatrices( projectionMatrix, matrixWorldInverse));
			var vector = new THREE.Vector3(item.x, item.y, item.z);
			if(frustum.containsPoint(vector)){
				fovobj.push(i);
			}
		}
	}
	/*
	* 
	*/
	postMessage({'type': 'itemsinfov', 'action': 'fov', 'item': fovobj});
}

onmessage = function(e) {
	// the passed-in data is available via e.data
	//console.log(e.data.currentTime
    playerEngineTime(e.data.boxobjs, e.data.currentTime, e.data.projectionMatrix,e.data.matrixWorldInverse);		
}

