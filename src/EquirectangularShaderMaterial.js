/** EquirectangularShaderMaterial */

import { ShaderMaterial } from 'three';
import { vertexShader, fragmentShader } from './EquirectangularShaderMaterial.glsl.js'

class EquirectangularShaderMaterial extends ShaderMaterial {
  constructor(textures) {
    super({
      uniforms: {
        tex: { value: textures },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
  }
}

export default EquirectangularShaderMaterial;
