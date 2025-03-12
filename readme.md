# equirect

Equirectangular camera extension for THREE.js

Example usage:
```
let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer();
let equirectCamera = new EquirectangularCamera();
scene.add(equirect.mesh);

// add objects
let group = new THREE.Group();
...

// update equirect camera
equirectCamera.position.set(1, 2, 3);
equirectCamera.lookAt(0, 0, 0);
equirect.mesh.visible = false;
equirectCamera.update(renderer, scene);

// render projection mesh
group.visible = false;
equirect.mesh.visible = true;

// render scene
renderer.render(scene, equirectCamera.camera);
```
