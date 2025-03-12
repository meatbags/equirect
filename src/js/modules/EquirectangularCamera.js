/** EquirectangularCamera */

import * as THREE from 'three';
import EquirectangularShaderMaterial from './EquirectangularShaderMaterial';

class EquirectangularCamera extends THREE.Object3D {
  constructor(size=256) {
    super();

    // orthographic camera
    this._camera = new THREE.OrthographicCamera(-1, 1, 0.5, -0.5, 0, 1000);
    this._camera.position.set(0, 0, 1);
    this._camera.lookAt(0, 0, 0);

    // cube camera group
    const textures = [];
    // px, nx, py, ny, pz, nz
    const conf = [
      [[0, 1, 0], [1, 0, 0]],
      [[0, 1, 0], [-1, 0, 0]],
      [[0, 0, -1], [0, 1, 0]],
      [[0, 0, -1], [0, -1, 0]],
      [[0, 1, 0], [0, 0, 1]],
      [[0, 1, 0], [0, 0, -1]],
    ];
    conf.forEach(c => {
      const up = c[0];
      const n = c[1];
      const camera = new THREE.PerspectiveCamera(-90, 1, 0.1, 10000);
      camera.up.set(up[0], up[1], up[2]);
      camera.lookAt(n[0], n[1], n[2]);
      camera.updateMatrixWorld();
      camera.userData.renderTarget = new THREE.WebGLRenderTarget(size, size, {
        format: THREE.RGBFormat,
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping,
      });
      textures.push(camera.userData.renderTarget.texture);
      this.add(camera);
    });

    // projection surface
    this._mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 1),
      new EquirectangularShaderMaterial(textures)
    );
  }

  /** get mesh */
  get mesh() {
    return this._mesh;
  }

  /** get camera */
  get camera() {
    return this._camera;
  }

  /** render cube-map textures */
  update(renderer, scene) {
    this.children.forEach(camera => {
      camera.updateMatrixWorld();
      renderer.setRenderTarget(camera.userData.renderTarget);
      renderer.render(scene, camera);
    });
    renderer.setRenderTarget(null);
  }
}

export default EquirectangularCamera;
