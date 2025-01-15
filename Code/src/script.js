import * as THREE from 'three'
import FloorShaderVertexShader from './shaders/FloorShader/vertex.glsl'
import FloorShaderFragmentShader from './shaders/FloorShader/fragment.glsl'
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import audioVisualVertexshader1 from './shaders/audioVisual1/AudioVisualvertex.glsl'
import audioVisualFragmentShader1 from './shaders/audioVisual1/AudioVisualfragment.glsl'
import audioVisualVertexshader2 from './shaders/audioVisual2/2AudioVisualVertex.glsl'
import audioVisualFragmentShader2 from './shaders/audioVisual2/2AudioVisualFragment.glsl'
import audioVisualVertexshader3 from './shaders/audioVisual3/3AudioVisualVertex.glsl'
import audioVisualFragmentShader3 from './shaders/audioVisual3/3AudioVisualFragment.glsl'
import audioVisualVertexshader4 from './shaders/audioVisual4/4AudioVisualVertex.glsl'
import audioVisualFragmentShader4 from './shaders/audioVisual4/4AudioVisualFragment.glsl'
import audioVisualVertexshader5 from './shaders/audioVisual5/5AudioVisualVertex.glsl'
import audioVisualFragmentShader5 from './shaders/audioVisual5/5AudioVisualFragment.glsl'
import audioVisualVertexshader6 from './shaders/audioVisual6/6AudioVisualVertex.glsl'
import audioVisualFragmentShader6 from './shaders/audioVisual6/6AudioVisualFragment.glsl'
import { PositionalAudioHelper } from 'three/addons/helpers/PositionalAudioHelper.js';
import { gsap } from 'gsap'




// Loading Manager
const loadingManager = new THREE.LoadingManager(
	// Loaded
	() => {
		gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0 })
		setTimeout(() => {
			scene.remove(overlay)
			console.log('removed')
		}, 4000);


	},
)


let camera, scene, renderer, controls;
let floorMaterial, AudioVisualmaterial, AudioVisualmaterial2, AudioVisualmaterial3,
	AudioVisualmaterial4, AudioVisualmaterial5, AudioVisualmaterial6;

// Loading Textures
const textureLoader = new THREE.TextureLoader(loadingManager)
const texture = textureLoader.load('Image1.jpeg')
const texture1 = textureLoader.load('Image2.jpeg')
const texture2 = textureLoader.load('Image3.jpeg')
const texture3 = textureLoader.load('Image4.jpeg')
const texture4 = textureLoader.load('Image5.jpeg')
const texture5 = textureLoader.load('Image6.jpeg')
const texture6 = textureLoader.load('Image7.jpeg')
texture.colorSpace = THREE.SRGBColorSpace
texture1.colorSpace = THREE.SRGBColorSpace
texture2.colorSpace = THREE.SRGBColorSpace
texture3.colorSpace = THREE.SRGBColorSpace
texture4.colorSpace = THREE.SRGBColorSpace
texture5.colorSpace = THREE.SRGBColorSpace
texture6.colorSpace = THREE.SRGBColorSpace

const objects = [];

let raycaster;

//POINTER CONTROLS
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

//POINTER CONTROLS
let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();


const clock = new THREE.Clock()

// Camera
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.y = 10;
//camera.position.x = 250;
camera.lookAt(new THREE.Vector3(100, 0, 0));

// Scene
scene = new THREE.Scene();
scene.background = new THREE.Color('#1d1f2a');
scene.fog = new THREE.Fog(0xffffff, 1000, 750);


// /**
//  * Overlay
//  */


const overlayGeometry = new THREE.PlaneGeometry(11.5, 11.5, 1, 1);
const overlayMaterial = new THREE.ShaderMaterial({
	transparent: true,
	uniforms:
	{
		uAlpha: { value: 1 }
	},
	vertexShader: `
						void main()
						{
							gl_Position = vec4(position, 1.0);
						}
					`,
	fragmentShader: `
					    uniform float uAlpha;
						void main()
						{
							gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
						}
					`
})
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);




//POINTER CONTROLS
controls = new PointerLockControls(camera, document.body);

const blocker = document.getElementById('blocker');
const instructions = document.getElementById('instructions');

instructions.addEventListener('click', function () {

	controls.lock();

});

controls.addEventListener('lock', function () {

	instructions.style.display = 'none';
	blocker.style.display = 'none';

});

controls.addEventListener('unlock', function () {

	blocker.style.display = 'block';
	instructions.style.display = '';

});

scene.add(overlay);



//POINTER CONTROLS
//to add pointer controls to the scene

scene.add(controls.getObject());

const onKeyDown = function (event) {

	switch (event.code) {

		case 'ArrowUp':
		case 'KeyW':
			moveForward = true;
			break;

		case 'ArrowLeft':
		case 'KeyA':
			moveLeft = true;
			break;

		case 'ArrowDown':
		case 'KeyS':
			moveBackward = true;
			break;

		case 'ArrowRight':
		case 'KeyD':
			moveRight = true;
			break;

		case 'Space':
			if (canJump === true) velocity.y += 350;
			canJump = false;
			break;

	}

};
//POINTER CONTROLS
const onKeyUp = function (event) {

	switch (event.code) {

		case 'ArrowUp':
		case 'KeyW':
			moveForward = false;
			break;

		case 'ArrowLeft':
		case 'KeyA':
			moveLeft = false;
			break;

		case 'ArrowDown':
		case 'KeyS':
			moveBackward = false;
			break;

		case 'ArrowRight':
		case 'KeyD':
			moveRight = false;
			break;

	}

};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);

// Floor Geometry


const floorGeometryNew = new THREE.BoxGeometry(2000, 1000, 1, 1000, 1000, 1000);
floorGeometryNew.rotateX(- Math.PI / 2);


let position = floorGeometryNew.attributes.position;


/**                
* Materials
*/


floorMaterial = new THREE.ShaderMaterial({
	vertexShader: FloorShaderVertexShader,
	fragmentShader: FloorShaderFragmentShader,
	uniforms:
	{
		uTime: new THREE.Uniform(0),
		uFrequency: { type: 'f', value: 0.0 },
		uColor: new THREE.Uniform(new THREE.Color('#141bf0')),
	},
	transparent: false,
	side: THREE.DoubleSide,
	depthWrite: false,
	blending: THREE.AdditiveBlending
})

const tempMaterial = new THREE.MeshBasicMaterial({

	map: texture
})



const floorNew = new THREE.Mesh(floorGeometryNew, floorMaterial);
scene.add(floorNew)

// AudioVisualmaterial
AudioVisualmaterial = new THREE.ShaderMaterial({
	vertexShader: audioVisualVertexshader1,
	fragmentShader: audioVisualFragmentShader1,
	side: THREE.DoubleSide,
	transparent: false,
	uniforms:
	{
		uTexture: { value: texture },
		uFrequency: { type: 'f', value: 0.0 },
		uTime: new THREE.Uniform(0)
	}
})


// AudioVisualmaterial2
AudioVisualmaterial2 = new THREE.ShaderMaterial({
	vertexShader: audioVisualVertexshader2,
	fragmentShader: audioVisualFragmentShader2,
	side: THREE.DoubleSide,
	transparent: false,
	uniforms:
	{
		uTexture: { value: texture2 },
		uFrequency: { type: 'f', value: 0.0 },
		uTime: new THREE.Uniform(0)
	}
})

// AudioVisualmaterial3
AudioVisualmaterial3 = new THREE.ShaderMaterial({
	vertexShader: audioVisualVertexshader3,
	fragmentShader: audioVisualFragmentShader3,
	side: THREE.DoubleSide,
	transparent: false,
	uniforms:
	{
		uTexture: { value: texture6 },
		uFrequency: { type: 'f', value: 0.0 },
		uTime: new THREE.Uniform(0)
	}
})

// AudioVisualmaterial4
AudioVisualmaterial4 = new THREE.ShaderMaterial({
	vertexShader: audioVisualVertexshader4,
	fragmentShader: audioVisualFragmentShader4,
	side: THREE.DoubleSide,
	transparent: false,
	uniforms:
	{
		uTexture: { value: texture5 },
		uFrequency: { type: 'f', value: 0.0 },
		uTime: new THREE.Uniform(0)
	}
})


// AudioVisualmaterial5
AudioVisualmaterial5 = new THREE.ShaderMaterial({
	vertexShader: audioVisualVertexshader5,
	fragmentShader: audioVisualFragmentShader5,
	side: THREE.DoubleSide,
	transparent: false,
	uniforms:
	{
		uTexture: { value: texture1 },
		uFrequency: { type: 'f', value: 0.0 },
		uTime: new THREE.Uniform(0)
	}
})


// AudioVisualmaterial6
AudioVisualmaterial6 = new THREE.ShaderMaterial({
	vertexShader: audioVisualVertexshader6,
	fragmentShader: audioVisualFragmentShader6,
	side: THREE.DoubleSide,
	transparent: false,
	uniforms:
	{
		uTexture: { value: texture4 },
		uFrequency: { type: 'f', value: 0.0 },
		uTime: new THREE.Uniform(0)
	}
})

//Boxes

const boxGeometry = new THREE.BoxGeometry(-1000, 80, 200).toNonIndexed();
const box = new THREE.Mesh(boxGeometry, AudioVisualmaterial5);
box.position.y = 40;
box.position.z = - 600;
box.rotateY(- Math.PI / 2)
scene.add(box);
objects.push(box);

const boxGeometry2 = new THREE.BoxGeometry(-1000, 80, 200)
const box2 = new THREE.Mesh(boxGeometry2, AudioVisualmaterial2);
box2.position.y = 40;
box2.position.x = 250;
box2.position.z = -600
box2.rotateY(- Math.PI / 2)
scene.add(box2);

const boxGeometry3 = new THREE.BoxGeometry(-1000, 80, 200)
const box3 = new THREE.Mesh(boxGeometry3, AudioVisualmaterial3);
box3.position.y = 40;
box3.position.z = 600
box3.rotateY(- Math.PI / 2)
scene.add(box3);

const boxGeometry4 = new THREE.BoxGeometry(1000, 80, 200)
const box4 = new THREE.Mesh(boxGeometry4, AudioVisualmaterial4);
box4.position.y = 40;
box4.position.x = 250
box4.position.z = 600
box4.rotateY(- Math.PI / 2)
scene.add(box4);


const boxGeometry5 = new THREE.BoxGeometry(-1000, 80, 200)
const box5 = new THREE.Mesh(boxGeometry5, AudioVisualmaterial);
box5.position.y = 40;
box5.position.x = -600;
scene.add(box5);

const boxGeometry6 = new THREE.BoxGeometry(-100, 80, 200)
const box6 = new THREE.Mesh(boxGeometry6, AudioVisualmaterial6);
box6.position.y = 40;
box6.position.x = 400;
scene.add(box6);

// Audio 1
const listener = new THREE.AudioListener();
camera.add(listener);


// create a global audio source
const sound = new THREE.PositionalAudio(listener);

sound.setDirectionalCone(180, 230, 1.0);

const helper = new PositionalAudioHelper(sound);
sound.add(helper);

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader(loadingManager);
audioLoader.load('./kop32now.mp3', function (buffer) {
	sound.setBuffer(buffer);
	window.addEventListener('click', function () {
		sound.setRefDistance(50);
		sound.play();


	})


});

// create an object for the sound to play from
const sphere = new THREE.SphereGeometry(1, 32, 16);
const speaker = new THREE.MeshPhongMaterial({
	color: 0xff2200,
	transparent: true,
	alphaHash: 0
});
const speakerMesh = new THREE.Mesh(sphere, speaker);
speakerMesh.rotation.y = Math.PI / 2
speakerMesh.position.x = -150
scene.add(speakerMesh);

// finally add the sound to the mesh
speakerMesh.add(sound);
// create an AudioAnalyser, passing in the sound and desired fftSize
const analyser = new THREE.AudioAnalyser(sound, 32);


//creating a second audio source
const listener2 = new THREE.AudioListener();
camera.add(listener2);


// create a second global audio source
const sound2 = new THREE.PositionalAudio(listener2);

sound.setDirectionalCone(180, 230, 0.1);

const helper2 = new PositionalAudioHelper(sound2);
sound.add(helper2);

// load a sound and set it as the Audio object's buffer
const audioLoader2 = new THREE.AudioLoader(loadingManager);
audioLoader2.load('./ulvmysofaturnsintoadesert.mp3', function (buffer) {
	sound2.setBuffer(buffer);
	window.addEventListener('click', function () {
		sound2.setRefDistance(20);
		sound2.play();


	})
});


// create a second object for the second sound to play from
const sphere2 = new THREE.SphereGeometry(1, 32, 16);
const speaker2 = new THREE.MeshPhongMaterial({
	color: 0xff2200,
	transparent: true,
	alphaHash: 0
});
const speakerMesh2 = new THREE.Mesh(sphere2, speaker2);
speakerMesh2.rotation.y = -Math.PI / 2
speakerMesh2.position.x = 300
speakerMesh2.position.z = -150
scene.add(speakerMesh2);

// finally add the sound to the mesh
speakerMesh2.add(sound2);

// create an AudioAnalyser, passing in the sound and desired fftSize
const analyser2 = new THREE.AudioAnalyser(sound2, 32);


// Renderer
renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// Resize
window.addEventListener('resize', onWindowResize);

// Resize
function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}



// Animation
function animate() {



	requestAnimationFrame(animate);

	const elapsedTime = clock.getElapsedTime()
	// Update material
	floorMaterial.uniforms.uTime.value = elapsedTime
	AudioVisualmaterial.uniforms.uTime.value = elapsedTime
	AudioVisualmaterial2.uniforms.uTime.value = elapsedTime
	AudioVisualmaterial3.uniforms.uTime.value = elapsedTime
	AudioVisualmaterial4.uniforms.uTime.value = elapsedTime
	AudioVisualmaterial5.uniforms.uTime.value = elapsedTime
	AudioVisualmaterial6.uniforms.uTime.value = elapsedTime


	//Update Audio Frequencies 

	floorMaterial.uniforms.uFrequency.value = analyser.getAverageFrequency()
	AudioVisualmaterial.uniforms.uFrequency.value = analyser.getAverageFrequency()
	AudioVisualmaterial2.uniforms.uFrequency.value = analyser2.getAverageFrequency()
	AudioVisualmaterial3.uniforms.uFrequency.value = analyser.getAverageFrequency()
	AudioVisualmaterial4.uniforms.uFrequency.value = analyser2.getAverageFrequency()
	AudioVisualmaterial5.uniforms.uFrequency.value = analyser.getAverageFrequency()
	AudioVisualmaterial6.uniforms.uFrequency.value = analyser2.getAverageFrequency()

	//POINTER CONTROLS
	const time = performance.now();

	if (controls.isLocked === true) {

		raycaster.ray.origin.copy(controls.getObject().position);
		raycaster.ray.origin.y -= 10;

		const intersections = raycaster.intersectObjects(objects, false);

		const onObject = intersections.length > 0;

		const delta = (time - prevTime) / 1000;

		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;

		velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

		direction.z = Number(moveForward) - Number(moveBackward);
		direction.x = Number(moveRight) - Number(moveLeft);
		direction.normalize(); // this ensures consistent movements in all directions

		if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
		if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

		if (onObject === true) {

			velocity.y = Math.max(0, velocity.y);
			canJump = true;

		}

		controls.moveRight(- velocity.x * delta);
		controls.moveForward(- velocity.z * delta);

		controls.getObject().position.y += (velocity.y * delta); // new behavior

		if (controls.getObject().position.y < 10) {

			velocity.y = 0;
			controls.getObject().position.y = 10;

			canJump = true;

		}

	}

	prevTime = time;

	renderer.render(scene, camera);


}

animate();