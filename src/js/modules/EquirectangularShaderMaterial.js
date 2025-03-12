/** EquirectangularShaderMaterial */

import * as THREE from 'three';

class EquirectangularShaderMaterial extends THREE.ShaderMaterial {
  constructor(textures) {
    super({
      uniforms: {
        tex: { value: textures },
      },
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        const float pi = 3.14159265359;
        const float pi2 = 6.28318530718;
        const float theta_off = 1.57079632679;
        uniform sampler2D tex[6];
        varying vec2 vUv;

        void main() {
          float theta = (2.0 * vUv.x - 1.0) * pi + theta_off;
          float phi = (vUv.y - 0.5) * pi;
          float x = cos(theta) * cos(phi);
          float y = sin(phi);
          float z = sin(theta) * cos(phi);
          float abs_x = abs(x);
          float abs_y = abs(y);
          float abs_z = abs(z);

          if (abs_x > abs_y && abs_x > abs_z) {
            if (x > 0.0) {
              float u = 0.5 * (-z / abs_x + 1.0);
              float v = 0.5 * (y / abs_x + 1.0);
              gl_FragColor = texture2D(tex[0], vec2(u, 1.0 - v)) + vec4(0.0, 0.25, 0.0, 0.0);
            } else {
              float u = 0.5 * (z / abs_x + 1.0);
              float v = 0.5 * (y / abs_x + 1.0);
              gl_FragColor = texture2D(tex[1], vec2(u, 1.0 - v)) + vec4(0.0, 0.25, 0.0, 0.0);
            }
          } else if (abs_y > abs_z && abs_y > abs_z) {
            if (y > 0.0) {
              float u = 0.5 * (-x / abs_y + 1.0);
              float v = 0.5 * (z / abs_y + 1.0);
              gl_FragColor = texture2D(tex[2], vec2(1.0 - u, v)) + vec4(0.0, 0.0, 0.25, 0.0);
            } else {
              float u = 0.5 * (x / abs_y + 1.0);
              float v = 0.5 * (z / abs_y + 1.0);
              gl_FragColor = texture2D(tex[3], vec2(1.0 - u, v)) + vec4(0.0, 0.0, 0.25, 0.0);
            }
          } else {
            if (z > 0.0) {
              float u = 0.5 * (x / abs_z + 1.0);
              float v = 0.5 * (y / abs_z + 1.0);
              gl_FragColor = texture2D(tex[4], vec2(u, 1.0 - v)) + vec4(0.25, 0.0, 0.0, 0.0);
            } else {
              float u = 0.5 * (-x / abs_z + 1.0);
              float v = 0.5 * (y / abs_z + 1.0);
              gl_FragColor = texture2D(tex[5], vec2(u, 1.0 - v)) + vec4(0.25, 0.0, 0.0, 0.0);
            }
          }
        }
      `,
    });
  }
}

export default EquirectangularShaderMaterial;
