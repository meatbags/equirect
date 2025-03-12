/** equirectangular shaders */

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  const float pi = 3.14159265359;
  const float pi2 = 6.28318530718;
  const float pi_2 = 1.57079632679;
  uniform sampler2D tex[6];
  varying vec2 vUv;

  void main() {
    float theta = pi_2 + (2.0 * vUv.x - 1.0) * pi;
    float phi = (vUv.y - 0.5) * pi;
    float x = cos(theta) * cos(phi);
    float y = sin(phi);
    float z = sin(theta) * cos(phi);
    float abs_x = abs(x);
    float abs_y = abs(y);
    float abs_z = abs(z);
    float u, v;

    if (abs_x > abs_y && abs_x > abs_z) {
      if (x > 0.0) {
        u = 0.5 * (-z / abs_x + 1.0);
        v = 1.0 - 0.5 * (y / abs_x + 1.0);
        gl_FragColor = texture2D(tex[0], vec2(u, v));
      } else {
        u = 0.5 * (z / abs_x + 1.0);
        v = 1.0 - 0.5 * (y / abs_x + 1.0);
        gl_FragColor = texture2D(tex[1], vec2(u, v));
      }
    } else if (abs_y > abs_z && abs_y > abs_z) {
      if (y > 0.0) {
        u = 1.0 - 0.5 * (-x / abs_y + 1.0);
        v = 0.5 * (z / abs_y + 1.0);
        gl_FragColor = texture2D(tex[2], vec2(u, v));
      } else {
        u = 1.0 - 0.5 * (x / abs_y + 1.0);
        v = 0.5 * (z / abs_y + 1.0);
        gl_FragColor = texture2D(tex[3], vec2(u, v));
      }
    } else {
      if (z > 0.0) {
        u = 0.5 * (x / abs_z + 1.0);
        v = 1.0 - 0.5 * (y / abs_z + 1.0);
        gl_FragColor = texture2D(tex[4], vec2(u, v));
      } else {
        u = 0.5 * (-x / abs_z + 1.0);
        v = 1.0 - 0.5 * (y / abs_z + 1.0);
        gl_FragColor = texture2D(tex[5], vec2(u, v));
      }
    }
  }
`;

export { vertexShader, fragmentShader };
