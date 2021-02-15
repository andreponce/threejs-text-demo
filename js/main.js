var container,stats;
var camera,scene,renderer;
var group_text,text;

var targetRotation = 0;
var targetRotationOnMouseDown = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

function init()
{
	init3D();
}

function init3D() 
{
	container 	= document.getElementById( 'container_render' );

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 5000 );
	camera.position.z = 500;

	scene = new THREE.Scene();

	var materialFront = new THREE.MeshBasicMaterial( { color: 0xffffff, overdraw:true } );
	var materialSide = new THREE.MeshBasicMaterial( { color: 0x000000, overdraw:true } );
	var materialArray = [ materialFront, materialSide ];
	var config = {

		size: 90,
		height: 20,
		curveSegments: 1,
		font: "arcadeclassic",
		style: "normal",
		bevelThickness: 1, 
		bevelSize: 4, 
		bevelEnabled:false,
		material: 0, 
		extrudeMaterial: 1

	};
	var text3d = new THREE.TextGeometry( "Ponce", config);
	var textMaterial = new THREE.MeshFaceMaterial(materialArray);

	text  = new THREE.Mesh( text3d, textMaterial );
	group_text = new THREE.Object3D();

	text3d.computeBoundingBox();

	text.position.x = -0.5 * ( text3d.boundingBox.max.x - text3d.boundingBox.min.x );
	text.position.y = -0.5 * ( text3d.boundingBox.max.y - text3d.boundingBox.min.y );
	text.position.z = 0;
	text.rotation.x = 0;
	text.rotation.y = Math.PI * 2;

	group_text.add( text );
	scene.add( group_text );

	renderer = Modernizr.webgl ? new THREE.WebGLRenderer({ alpha: true, antialias: true }) : new THREE.CanvasRenderer({ alpha: true });
	//renderer = new THREE.SoftwareRenderer();
	//renderer.setClearColor( 0x909990 );

	container.appendChild( renderer.domElement );

	/*stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );*/

	container.addEventListener( 'mousedown', onDocumentMouseDown, false );
	container.addEventListener( 'touchstart', onDocumentTouchStart, false );
	container.addEventListener( 'touchmove', onDocumentTouchMove, false );
	window.addEventListener( 'resize', onWindowResize, false );

	text.scale.z    = 0.0001;
	group_text.position.y = -window.innerHeight*.5-150*Math.max(group_text.scale.x,0.6);
	group_text.rotation.x = 3.2;
	TweenLite.to(group_text.position,1.5,{y:0,ease:Back.easeOut,delay:1,easeParams:[1]});
	TweenLite.to(group_text.rotation,1.5,{x:0,ease:Back.easeInOut,delay:1});
	TweenLite.to(text.scale,1,{z:1,ease:Quad.easeInOut,delay:1.5});

	onWindowResize();
	render();
}

function onWindowResize() 
{
	var window_Width  = window.innerWidth;
	var window_height = window.innerHeight;

	windowHalfX = window_Width*.5;
	windowHalfY = window_height*.5;

	camera.aspect = window_Width/window_height;
	camera.updateProjectionMatrix();

	group_text.scale.x = group_text.scale.y = group_text.scale.z = window_Width/window_height;

	renderer.setSize( window_Width, window_height );
	console.log(1);
}

function onDocumentMouseDown(event) 
{
	event.preventDefault();

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'mouseout', onDocumentMouseOut, false );

	mouseXOnMouseDown = event.clientX - windowHalfX;
	targetRotationOnMouseDown = targetRotation;
}

function onDocumentMouseMove(event) 
{
	mouseX 			= event.clientX - windowHalfX;
	targetRotation  = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.02;
}

function onDocumentMouseUp(event) 
{
	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

function onDocumentMouseOut(event) 
{
	document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
	document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
	document.removeEventListener( 'mouseout', onDocumentMouseOut, false );
}

function onDocumentTouchStart(event) 
{
	if ( event.touches.length == 1 ) 
	{
		event.preventDefault();
		mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
		targetRotationOnMouseDown = targetRotation;
	}
}

function onDocumentTouchMove(event) 
{
	if ( event.touches.length == 1 ) 
	{
		event.preventDefault();
		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		targetRotation = targetRotationOnMouseDown + ( mouseX - mouseXOnMouseDown ) * 0.03;
	}
}

function render() 
{
	requestAnimationFrame( render );
	group_text.rotation.y += ( targetRotation - group_text.rotation.y ) * 0.05;
	renderer.render( scene, camera );
	//stats.update();
}

function over(target)
{
	TweenMax.to(target,.4, {css:{backgroundPosition:"0px -30px"},ease:Quart.easeOut});
}

function out(target)
{
	TweenMax.to(target,.4, {css:{backgroundPosition:"0px 0px"},ease:Quart.easeOut});
}

init();