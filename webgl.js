/*
	

*/
//import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';

//import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
//import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/OBJLoader.js';



let camera, scene, renderer, controls, mesh, light, model;

let image = document.querySelector('#ocean');

function init() {
	scene = new THREE.Scene();

	let width = window.innerWidth;
	let height = window.innerHeight;

	camera = new THREE.PerspectiveCamera(45, width/height, 1, 25000);
	camera.position.set(0, 400, 600);
	scene.add(camera);

	let light = new THREE.DirectionalLight(0xfffffff, 0.9); // color, intensity
	light.position.set(1, 1, 1); // location x, y, z
	scene.add(light);

	scene.fog = new THREE.Fog(0xffffff, 1, 1100); // color, near, far

/*
	var loader1 = new THREE.JSONLoader();
    loader1.load( 
    	"js/model.json", 
		function ( object ) {
		    var geometry = new THREE.SphereGeometry(3,32,32);
		    var material = new THREE.MeshBasicMaterial();
		    var object = new THREE.Mesh( geometry, material );
		    scene.add( object );

		},

		// onProgress callback
		function ( xhr ) {
			console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
		},


		// onError callback
		function ( err ) {
			console.error( 'An error happened' );
		}

		
	);

*/	




	// instantiate a GL Transmission Format loader
	let loader1 = new THREE.GLTFLoader();
	// load a glTF resource
	loader1.load(
    // resource URL
    'scene.gltf',
    // called when the resource is loaded
    function(gltf) {
      model = gltf.scene;
      scene.add(model);

      gltf.animations; // Array<THREE.AnimationClip>
      gltf.scene; // THREE.Scene
      gltf.scenes; // Array<THREE.Scene>
      gltf.cameras; // Array<THREE.Camera>
      gltf.asset; // Object
    }
  );

	renderer = new THREE.WebGLRenderer({alpha: 1, antialias: true});
	renderer.setPixelRatio(window.devicePixelRatio); // scale for device resolution
	renderer.setSize(width, height);

	controls = new THREE.OrbitControls(camera, renderer.domElement);

	document.body.appendChild(renderer.domElement);
}

function heightMap() {
	const canvas = document.getElementById('drawing');
	const context = canvas.getContext('2d');

	context.drawImage(image, 0, 0, 200, 200);

	let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	console.log('Width: ' + imageData.width);
	console.log('Height: ' + imageData.height);

	let data = imageData.data;
	return data;
}

function vertices() {
	data = heightMap();

	let loader = new THREE.TextureLoader();

	let material = new THREE.MeshLambertMaterial({map: loader.load('js/ocean.jpg'), side: THREE.DoubleSide});

	// width, height, segments
	let geometry = new THREE.PlaneGeometry(800, 800, 199, 199);
	mesh = new THREE.Mesh(geometry, material);

	console.log(mesh.geometry.attributes.position.array.length);

	// generate height based on lightness of heigh map pixel
	for (let i = 0; i < data.length; i+=4 ) {
		// visit the red channel of every pixel from the height map for vertex Z axis
		mesh.geometry.attributes.position.array[i /4 * 3 + 2] = data[i];

		
	}

	mesh.rotation.x = -Math.PI / 2; // rotate flat

	// necessary for adding light to the scene
	geometry.computeVertexNormals();

	scene.add(mesh);

	
}

function animate() {
	renderer.render(scene, camera);

	controls.update();

	let date = new Date(); // get date string
	let timer = date.getTime() * 0.0002; // get time string, changing speed
	light.position.x = 800 * Math.cos(timer); // multiplier changes X coordinate
	light.position.z = 800 * Math.sin(timer); // multiplier changes Z coordinate


	camera.position.x = 800 * Math.cos(timer); // multiplier changes X coordinate
	camera.position.z = 800 * Math.sin(timer); // multiplier changes Z coordinate
	

	if (model) {
		model.rotation.y += 0.01;
	}
	requestAnimationFrame(animate);
}


window.addEventListener('load', () => {
	init();
	vertices();
	animate();
})




