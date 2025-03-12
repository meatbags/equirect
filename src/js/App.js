/** App */

import * as THREE from 'three';
import EquirectangularCamera from './modules/EquirectangularCamera';
import { Element } from '@meatbags/element';

class App {
  constructor() {
    // renderer
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.setSize(width, height);
    document.querySelector('#app-target').appendChild(this.renderer.domElement);

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

    // offscreen scene
    this.scene2 = new THREE.Scene();
    this.scene2.add(new THREE.Mesh(
      new THREE.BoxGeometry(55, 55, 55),
      new THREE.MeshStandardMaterial({
        side: THREE.BackSide,
      }))
    );
    this.cubes = [];
    for (let i=0; i<1000; i++) {
      const geo = new THREE.BoxGeometry(1, 2, 1);
      const mat = new THREE.MeshPhysicalMaterial();
      const cube = new THREE.Mesh(geo, mat);
      while (Math.abs(cube.position.x) < 1) {
        cube.position.x = (Math.random() * 2 - 1) * 25;
        cube.position.y = (Math.random() * 2 - 1) * 25;
        cube.position.z = (Math.random() * 2 - 1) * 25;
      }
      mat.color.setRGB((cube.position.y + 10 / 20), 1, (-cube.position.y + 10 / 20));
      this.scene2.add(cube);
      this.cubes.push(cube);
    }

    // set camera target
    this.equirectCamera = new EquirectangularCamera(2048);
    this.cameraTarget = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 12), new THREE.MeshBasicMaterial({color: 0xffffff}))
    this.cameraTarget.add(new THREE.PointLight(0xffffff, 100, 50, 2));
    this.scene2.add(this.cameraTarget);
    this.scene.add(this.equirectCamera.mesh);

    // loop
    this.time = {
      now: performance.now(),
      age: 0
    };
    this.loop();
  }

  /** download image */
  downloadImage() {
    // const renderer = this.renderer.clone();
    this.renderer.setSize(4096, 2048);
    this.renderer.render(this.scene, this.equirectCamera.camera);
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
    this.equirectCamera.update(this.renderer, this.scene2);
    this.renderer.render(this.scene, this.equirectCamera.camera);
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
