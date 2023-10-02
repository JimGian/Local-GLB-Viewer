import { render } from 'react-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'






var clock = new THREE.Clock()
let delta = clock.getDelta();



export default class SceneInit {


   constructor(canvasId) {
    // NOTE: Core components to initialize Three.js app.
    this.scene ;
    this.camera ;
    this.renderer ;

    // NOTE: Camera params;
    this.fov = 45;
    this.nearPlane = 1;
    this.farPlane = 1000;
    this.canvasId = canvasId;

    // NOTE: Additional components.
    this.clock ;
    this.stats ;
    this.controls ;


    // NOTE: Lighting is basically required.
    this.ambientLight ;
    this.directionalLight;

    //undefined
  }

  initialize() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );

    /////////================================================================================

    ///===================================Spot
    const spotLight = new THREE.SpotLight( "yellow" , 1);
    spotLight.position.set( 0,2,-10);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 60;
    this.scene.add( spotLight );
    ///===================================Spot1
    const spotLight1 = new THREE.SpotLight( 'yellow',1 );
    spotLight1.position.set( -15,5,2 );
    spotLight1.castShadow = true;
    spotLight1.shadow.mapSize.width = 1024;
    spotLight1.shadow.mapSize.height = 1024;
    spotLight1.shadow.camera.near = 500;
    spotLight1.shadow.camera.far = 4000;
    spotLight1.shadow.camera.fov = 100;
    this.scene.add( spotLight1 );
    ///===================================Spot2
    const spotLight2 = new THREE.SpotLight( 'white' , 0.5);
    spotLight2.position.set( -10,1,30 );
    spotLight2.castShadow = true;
    spotLight2.shadow.mapSize.width = 1024;
    spotLight2.shadow.mapSize.height = 1024;
    spotLight2.shadow.camera.near = 500;
    spotLight2.shadow.camera.far = 4000;
    spotLight2.shadow.camera.fov = 30;
    this.scene.add( spotLight2 );
    
    ////////==================================================================================
    
    
    //===================================Directional Light ===================================

    const light = new THREE.DirectionalLight(0x87CEEB, 1)
    this.scene.add(light)
    const light1 = new THREE.DirectionalLight(0xFFFFFF, 2)
    this.scene.add(light1)
    //========================================================================================
    //===================================FOG==================================================
   
    const color = 0x000000;  // white
    const near = 3;
    const far = 20;
    this.scene.fog = new THREE.Fog(color, near, far);
    


    //========================================================================================
    //========================================planet==========================================

    const geometry = new THREE.PlaneGeometry( 1000, 1000 );
    const material = new THREE.MeshBasicMaterial( {color: "#40631F", side: THREE.DoubleSide,receiveShadow: true } );
    const plane = new THREE.Mesh( geometry, material );
    if ( plane.isMesh) {
      plane.rotation.x = Math.PI * -0.5
      this.scene.add( plane );    
    }
    //=========================================================================================
    
    //===================================Map Load =================================
    const glftLoaderMap = new GLTFLoader();
	  glftLoaderMap.load('../models/HMap.glb', (gltfSceneMap) => {
      gltfSceneMap.scene.traverse( function( objectMap ) {

        if ( objectMap.isMesh) {

          gltfSceneMap.scene.position.set(0,0,0);
         
          objectMap.castShadow = true;
          objectMap.receiveShadow = true;
          

        }
      } );
		this.scene.add( gltfSceneMap.scene );
	  } );
    //====================================================================

    

    // NOTE: Specify a canvas which is already created in the HTML.
    const canvas = document.getElementById(this.canvasId);
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      // NOTE: Anti-aliasing smooths out the edges.
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    // this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 10;
    this.controls.minPolarAngle= 0.2 ;
    this.controls.maxPolarAngle = Math.PI / 2.1 ;
    this.controls.maxDistance = 20;
    this.controls.target.set(0,1,0);
    this.controls.enableDamping = true;
    this.controls.enablePan = false;

   
    


    
    this.stats = Stats();
    document.body.appendChild(this.stats.dom);

    // ambient light which is for the whole scene
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.1);

    this.ambientLight.castShadow = true;
    this.scene.add(this.ambientLight);

    // directional light - parallel sun rays
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
    // this.directionalLight.castShadow = true;
    this.directionalLight.position.set(0, 32, 64);
    this.scene.add(this.directionalLight);

    // if window resizes
    window.addEventListener('resize', () => this.onWindowResize(), false);

   

   animate() {
    // NOTE: Window is implied.
    // requestAnimationFrame(this.animate.bind(this));

    var delta = clock.getDelta();

    window.requestAnimationFrame(this.animate.bind(this));
    this.render();
    this.stats.update();
    this.controls.update();

   }
    
  

  render() {
    // NOTE: Update uniform data on each render.
    // this.uniforms.u_time.value += this.clock.getDelta();
    this.renderer.render(this.scene, this.camera);
    
    
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

