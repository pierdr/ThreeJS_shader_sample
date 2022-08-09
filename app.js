import * as THREE from "three";
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import fragment from "./shader/fragment.glsl";
import vertex from "./shader/vertex.glsl";
import simFragment from "./shader/simFragment.glsl";
import simVertex   from "./shader/simVertex.glsl";

// import vertexParticles from "./shader/vertexParticles.glsl";
import * as dat from "dat.gui";
import forest1 from "./img/forest1.png";
import forest2 from "./img/forest2.png";



// import { TimelineMax } from "gsap";
let OrbitControls = require("three-orbit-controls")(THREE);

export default class Sketch {
  constructor(selector) {
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x000000, 1);

    this.container = document.getElementById("container");
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.container.appendChild(this.renderer.domElement);


    /* LOAD TEXTURES */
    this.textures = [new THREE.TextureLoader().load(forest1),new THREE.TextureLoader().load(forest2)];

    this.move = 0;

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      10,
      3000
    );
 
    // var frustumSize = 10;
    // var aspect = window.innerWidth / window.innerHeight;
    // this.camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -1000, 1000 );
    this.camera.position.set(0, 0, 750);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    this.paused = false;



    this.setupResize();

    this.mouseWheel();

    this.addSimplePlane();

    this.render();
    this.settings();
    
  }

  mouseWheel()
  {
    console.log("mouse WHEEL");
    window.addEventListener('wheel', (e)=>{
     
      this.move += e.wheelDeltaY*0.01;
    });
   
  }

  settings() {
    let that = this;
    this.settings = {
      value: 0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "value", 0, 100, 0.01);
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;


    // image cover
    this.imageAspect = 853/1280;
    let a1; let a2;
    if(this.height/this.width>this.imageAspect) {
      a1 = (this.width/this.height) * this.imageAspect ;
      a2 = 1;
    } else{
      a1 = 1;
      a2 = (this.height/this.width) / this.imageAspect;
    }

    this.material.uniforms.resolution.value.x = this.width;
    this.material.uniforms.resolution.value.y = this.height;
    this.material.uniforms.resolution.value.z = a1;
    this.material.uniforms.resolution.value.w = a2;

    this.camera.updateProjectionMatrix();

  }
  addSimplePlane()
  {
    this.geometry = new THREE.PlaneGeometry(500,500);
    this.material = new THREE.ShaderMaterial({
      fragmentShader:fragment,
      vertexShader:vertex,
      uniforms:{
        progress:{type:"f",value:0},
        tex1:{type:"t",value:this.textures[1]}

      },
      side:THREE.DoubleSide
    });

    this.mesh = new THREE.Mesh(this.geometry,this.material);
   this.scene.add(this.mesh); 
  }
  stop() {
    this.paused = true;
  }

  play() {
    this.paused = false;
    this.render();
  }

  render() {
    if (this.paused) return;
    this.time += 1;

    this.renderer.render(this.scene, this.camera);
    this.material.uniforms.tex1.value = this.textures[0];
    // this.material.uniforms.time.value = this.time;
    // this.material.uniforms.move.value = this.move;
    requestAnimationFrame(this.render.bind(this));
    
  }
}

new Sketch("container");
