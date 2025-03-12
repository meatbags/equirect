/** App */

import * as THREE from 'three';
import EquirectangularCamera from '../../../src/EquirectangularCamera';
import { Element } from '@meatbags/element';

class App {
  constructor() {
    // renderer
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(width, height);
    document.querySelector('#app-target').appendChild(this.renderer.domElement);

    // take screenshot
    const button = Element({
      type: 'button',
      style: {
        position: 'absolute',
        top: '10px',
        left: '10px',
        cursor: 'pointer',
      },
      addEventListener: {
        click: () => {
          this.downloadImage();
        }
      },
      innerText: 'Download image'
    });
    document.querySelector('#app-target').appendChild(button);

    // on resize
    window.addEventListener('resize', () => {
      this.resize();
    });

    // scene
    this.scene = new THREE.Scene();
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(50, 50, 50),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        side: THREE.BackSide,
      })
    );
    box.receiveShadow = true;
    this.scene.add(box);
    this.cubes = [];
    for (let i=0; i<200; i++) {
      const geo = new THREE.BoxGeometry(1, 10, 1);
      const mat = new THREE.MeshPhysicalMaterial();
      const cube = new THREE.Mesh(geo, mat);
      cube.castShadow = true;
      cube.receiveShadow = true;
      while (Math.abs(cube.position.x) < 1) {
        cube.position.x = (Math.random() * 2 - 1) * 30;
        cube.position.y = (Math.random() * 2 - 1) * 30;
        cube.position.z = (Math.random() * 2 - 1) * 30;
      }
      mat.color.setRGB((cube.position.y + 10 / 20), 1, (-cube.position.y + 10 / 20));
      this.scene.add(cube);
      this.cubes.push(cube);
    }

    // equirectangular camera
    this.equirectCamera = new EquirectangularCamera(1024);

    // set camera target
    this.cameraTarget = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 12), new THREE.MeshBasicMaterial({color: 0xffffff}))
    const light = new THREE.PointLight(0xffffff, 200, 100, 2);
    light.castShadow = true;
    this.cameraTarget.add(light);
    this.scene.add(this.cameraTarget);

    // loop
    this.time = {
      now: performance.now(),
      age: 0
    };
    this.loop();
  }

  /** download image */
  downloadImage() {
    this.renderer.setSize(2048, 1024);
    this.renderer.render(this.equirectCamera.scene, this.equirectCamera.camera);
    this.renderer.domElement.toBlob(blob => {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = 'equirect.png';
      a.click();
      this.resize();
    });
  }

  /** resize */
  resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /** update */
  update(delta) {
    this.time.age += delta;
    const theta = this.time.age * Math.PI * 2 / 10;
    const x = Math.sin(theta) * 10;
    const y = Math.sin(theta * 2) * 5;
    const z = Math.cos(theta) * 10;
    this.cameraTarget.position.set(x, y, z);
    this.equirectCamera.lookAt(this.cameraTarget.position);
  }

  /** render */
  render() {
    // render output
    this.equirectCamera.update(this.renderer, this.scene);
    this.renderer.render(this.equirectCamera.scene, this.equirectCamera.camera);
  }

  /** loop */
  loop() {
    // loop
    requestAnimationFrame(() => this.loop());

    // update, render
    let now = performance.now();
    let delta = (now - this.time.now) / 1000;
    this.time.now = now;
    this.update(delta);
    this.render();
  }
}

export default App;
