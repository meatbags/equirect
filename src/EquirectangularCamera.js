/** EquirectangularCamera */

import {
  Object3D, OrthographicCamera, PerspectiveCamera, WebGLRenderTarget, RGBFormat,
  PlaneGeometry, Mesh, Scene
} from 'three';
import EquirectangularShaderMaterial from './EquirectangularShaderMaterial';

class EquirectangularCamera extends Object3D {
  constructor(size=512) {
    super();

    // orthographic camera
    this._camera = new OrthographicCamera(-1, 1, 0.5, -0.5, 0, 1000);
    this._camera.position.set(0, 0, 1);
    this._camera.lookAt(0, 0, 0);

    // cube camera [px, nx, py, ny, pz, nz]
    const textures = [];
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
      const camera = new PerspectiveCamera(-90, 1, 0.1, 10000);
      camera.up.set(up[0], up[1], up[2]);
      camera.lookAt(n[0], n[1], n[2]);
      camera.updateMatrixWorld();
      camera.userData.renderTarget = new WebGLRenderTarget(size, size, {
        format: RGBFormat,
      });
      textures.push(camera.userData.renderTarget.texture);
      this.add(camera);
    });

    // projection surface
    this._mesh = new Mesh(
      new PlaneGeometry(2, 1),
      new EquirectangularShaderMaterial(textures)
    );

    // output scene
    this._scene = new Scene();
    this._scene.add(this._mesh);
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

  get camera() {
    return this._camera;
  }

  get mesh() {
    return this._mesh;
  }

  get scene() {
    return this._scene;
  }
}

export default EquirectangularCamera;
