/**
 * Hotspot creation functions.
 *
 */

/**
 * Generic hotspot creation function
 * x, y, z: position in space
 * rx, ry, rz: rotation in space
 * s: scale
 *
 */
function createShapeHotspot (shape, color, x, y, z, rx, ry, rz, s) {
  // Flat shape
  var geometry = new THREE.ShapeBufferGeometry(shape);
  var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide }));

  // Options
  mesh.material.transparent = true;
  mesh.material.opacity = 0.6;
  mesh.position.set(x, y, z);
  mesh.rotation.set(rx, ry, rz);
  mesh.scale.set(s, s, s);
  mesh.userData.kind = 'hotspot';

  return mesh;
}

/**
 * Circle hotspot creation function
 *
 */
function createCircleHotspot (color, scale) {
  // Circle
  var circle;
  var circleRadius = 1;
  var circleShape = new THREE.Shape();

  // Circle drawing
  circleShape.moveTo(0, circleRadius);
  circleShape.quadraticCurveTo(circleRadius, circleRadius, circleRadius, 0);
  circleShape.quadraticCurveTo(circleRadius, -circleRadius, 0, -circleRadius);
  circleShape.quadraticCurveTo(-circleRadius, -circleRadius, -circleRadius, 0);
  circleShape.quadraticCurveTo(-circleRadius, circleRadius, 0, circleRadius);

  circle = createShapeHotspot(circleShape, color, 0, 0, 0, 0, 0, 0, scale);
  circle.lookAt(0, 0, 0);

  return circle;
}

/**
 * Triangle hotspot creation function
 *
 */
function createTriangleHotspot (color, scale) {
  var triangle;
  var triangleShape = new THREE.Shape();

  // Center the triangle on the incenter. Side measure is 1.
  triangleShape.moveTo(-(1/2), -(Math.sqrt(3)/6));
  triangleShape.lineTo(0, Math.sqrt(3)/3);
  triangleShape.lineTo(1/2, -(Math.sqrt(3)/6));
  triangleShape.lineTo(-(1/2), -(Math.sqrt(3)/6));

  triangle = createShapeHotspot(triangleShape, color, 0, 0, 0, 0, 0, 0, scale);
  triangle.lookAt(0, 0, 0);

  return triangle;
}

/**
 * Square hotspot creation function
 *
 */
 function createSquareHotspot (color, scale) {
   var square;
   var squareShape = new THREE.Shape();

   // Square drawing
   squareShape.moveTo(-1/2, 1/2);
   squareShape.lineTo(1/2, 1/2);
   squareShape.lineTo(1/2, -1/2);
   squareShape.lineTo(-1/2, -1/2);
   squareShape.lineTo(-1/2, 1/2);

   square = createShapeHotspot(squareShape, color, 0, 0, 0, 0, 0, 0, scale);
   square.lookAt(0, 0, 0);

   return square;
 }

/**
 * Star hotspot
 *
 */
function createStarHotspot (color, scale) {
  var starPoints = [];
  var f = 30;

	starPoints.push( new THREE.Vector2 (   0/f,  50/f ) );
	starPoints.push( new THREE.Vector2 (  10/f,  10/f ) );
	starPoints.push( new THREE.Vector2 (  40/f,  10/f ) );
	starPoints.push( new THREE.Vector2 (  20/f, -10/f ) );
	starPoints.push( new THREE.Vector2 (  30/f, -50/f ) );
	starPoints.push( new THREE.Vector2 (   0/f, -20/f ) );
	starPoints.push( new THREE.Vector2 ( -30/f, -50/f ) );
	starPoints.push( new THREE.Vector2 ( -20/f, -10/f ) );
	starPoints.push( new THREE.Vector2 ( -40/f,  10/f ) );
	starPoints.push( new THREE.Vector2 ( -10/f,  10/f ) );

  var starShape = new THREE.Shape(starPoints);

  var star = createShapeHotspot(starShape, color, 0, 0, 0, 0, 0, 0, scale);
  star.lookAt(0, 0, 0);

  return star;
}
