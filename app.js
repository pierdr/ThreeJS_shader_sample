import * as THREE from "three";
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import fragment from "./shader/fragment.glsl";
import vertex from "./shader/vertex.glsl";
// import vertexParticles from "./shader/vertexParticles.glsl";
import * as dat from "dat.gui";
import forest1 from "./img/forest1.png";
import forest2 from "./img/forest2.png";

// import { TimelineMax } from "gsap";
// let OrbitControls = require("three-orbit-controls")(THREE);

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
    // this.camera = new THREE.PerspectiveCamera(
    //   45,
    //   window.innerWidth / window.innerHeight,
    //   0.01,
    //   50
    // );
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
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
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


    // optional - cover with quad
    // const dist  = this.camera.position.z;
    // const height = 1;
    // this.camera.fov = 2*(180/Math.PI)*Math.atan(height/(2*dist));

    // // if(w/h>1) {
    // if(this.width/this.height>1){
    //   this.plane.scale.x = this.camera.aspect;
    //   // this.plane.scale.y = this.camera.aspect;
    // } else{
    //   this.plane.scale.y = 1/this.camera.aspect;
    // }

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
  //---------------------------------------------------------------------------------
  // addParticles()
  // {
  //   this.geometry = new THREE.BufferGeometry();

  //   this.material = new THREE.ShaderMaterial({
  //     fragmentShader:fragment,
  //     vertexShader:vertex,
  //     uniforms:{
  //       progress:{type:"f",value:0},
  //       t1:{type: "t",value:this.textures[0]},
  //       t2:{type:"t",value:this.textures[1]},
  //       mask:{type:"t",value:this.mask},
  //       move:{type:"f",value:0},
  //       time:{type:"f",value:0}
  //     },
  //     transparent:true,
  //     depthTest:false,
  //     depthWrite:false,
  //     side:THREE.DoubleSide
  //   });

  //   let numberOfParticles = 512*512;

  //   //THIS ATTRIBUTE GIVES THE LOCATION TO THE PARTICLES
  //   this.positions = new THREE.BufferAttribute(new Float32Array(numberOfParticles*3),3);

  //   //THE COORDINATE ATTRIBUTE IS MEANT TO HELP POSITION THE TEXTURE TO THE PARTICLES
  //   this.coordinates = new THREE.BufferAttribute(new Float32Array(numberOfParticles*3),3);

  //   //THIS OFFEST IS USED FOR THE ANIMATION OF THE TUNNEL
  //   this.offsets = new THREE.BufferAttribute(new Float32Array(numberOfParticles*1),1);
    
  //   //THIS SPEED IS RELATIVE TO EACH PARTICLE AND GIVES EACH PARTICLE A DIFFERENT SPEED
  //   this.speeds = new THREE.BufferAttribute(new Float32Array(numberOfParticles),1);

  //   //RANDOMIZER
  //   function rand(a,b)
  //   {
  //     return a+ (b-a)*Math.random();
  //   }

  //   var index = 0;
  //   for (let i = 0.0; i < 512.0; i++) {
  //     let posX = i-256;
  //     for (let j = 0.0; j < 512.0; j++) {

  //       this.positions.setXYZ(index, posX , j-256 , 0.0);
  //       this.coordinates.setXYZ(index,i,j,0);
  //       this.speeds.setX(index,rand(0.4,1.0));
  //       this.offsets.setX(index,rand(-200,3000));
  //       index++;
        
  //     }
  //   }
  //   this.geometry.setAttribute("position", this.positions);
  //   this.geometry.setAttribute("aCoordinates",this.coordinates);
  //   this.geometry.setAttribute("aSpeed",this.speeds);
  //   this.geometry.setAttribute("aOffset",this.offsets);
  //   this.mesh = new THREE.Points(this.geometry,this.material);
  //  this.scene.add(this.mesh); 
  // }

  // addObjects() {
  //   let that = this;
  //   this.material = new THREE.ShaderMaterial({
  //     extensions: {
  //       derivatives: "#extension GL_OES_standard_derivatives : enable"
  //     },
  //     side: THREE.DoubleSide,
  //     uniforms: {
  //       time: { type: "f", value: 0 },
  //       resolution: { type: "v4", value: new THREE.Vector4() },
  //       uvRate1: {
  //         value: new THREE.Vector2(1, 1)
  //       }
  //     },
  //     // wireframe: true,
  //     // transparent: true,
  //     vertexShader: vertex,
  //     fragmentShader: fragment
  //   });

  //   // this.geometry = new THREE.PlaneGeometry(1, 1, 100, 100);
  //   this.geometry  =  new THREE.BufferGeometry();
  //   let number = 512 * 512;
  //   this.positions = new THREE.BufferAttribute(new Float32Array(number*3),3.0);
  //   let index = 0;
  //   for(let i = 0.0;i<512.0;i++)
  //   {
  //     let posX = i-256;
  //     for(let j=0.0;j<512.0;j++)
  //     {
  //       this.positions.set(index,posX*2,(j-256)*2,0.0);
  //       index++;
  //     }
  //   }
  //   this.geometry.setAttribute("position",this.positions);

  //   this.plane = new THREE.Points(this.geometry, this.material);
  //   this.scene.add(this.plane);
  // }

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
