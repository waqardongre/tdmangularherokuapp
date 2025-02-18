import { Component, OnInit } from '@angular/core';
import { ViewmodelService } from 'src/app/services/viewmodel/viewmodel.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-viewmodel',
  templateUrl: './viewmodel.component.html',
  styleUrls: ['./viewmodel.component.css']
})
export class ViewmodelComponent implements OnInit {
  
  model;
  filename;
  fileexist = false;
  
  scene: any;
  camera: any;
  renderer: any;

  constructor(
    private viewmodelservice: ViewmodelService,
    private route: ActivatedRoute,
    private router: Router
    ) { 
  }

  ngOnInit() {
    this.filename = this.route.snapshot.queryParams["filename"];
    this.mainfun(this.filename);
  }

  mainfun(filename){
    
    // Getting 3D model from service method getModel
    this.viewmodelservice.getModel(filename)
    .subscribe({
      next: (request) => {
        var url = window.URL.createObjectURL(request);
        RenderModel(url)
      },
      error: (e) => console.error(e)
    })

    function RenderModel(url)
    {
      let camera, scene, renderer;
          
      init();
      render();

      function init() {

        const container = document.getElementById( 'renderingdiv' );

        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 10000 );
        camera.position.set( -2.5, 0, 3.0 );
        
        scene = new THREE.Scene();
        
        // Rendering 3d model
        const loader = new GLTFLoader()
    
        loader.load( url, function ( gltf ) {  
          
          gltf.scene.scale.set( 6.0, 6.0, 6.0 )

          scene.add( gltf.scene )

          scene.background = new THREE.Color('#ffffff')
          var ambientLight = new THREE.AmbientLight('#ffffff', 1)
          scene.add(ambientLight)
          var directionalLight = new THREE.DirectionalLight('#ffffff', 2)
          directionalLight.position.set(1, 1, 1)
          directionalLight.castShadow = true
          scene.add(directionalLight)

          render()

        })

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        renderer.outputEncoding = THREE.sRGBEncoding;
        container.appendChild( renderer.domElement );

        const controls = new OrbitControls( camera, renderer.domElement );
        controls.addEventListener( 'change', render ); // use if there is no animation loop
        controls.minDistance = 0.1;
        controls.maxDistance = 10000;
        controls.target.set( 0, 0, 0 );
        controls.update();

        window.addEventListener( 'resize', onWindowResize );

      }

      function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

        render();

      }

      function render() {

        renderer.render( scene, camera );

      }
    }
  }

  routeToUpload() {
    this.router.navigateByUrl("/");
  }
}