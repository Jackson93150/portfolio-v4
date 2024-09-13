import * as THREE from 'three';

export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uWaveSpeed; // Add a new uniform for wave speed

  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vNormal;

  float wave(float waveSize, float tipDistance, float centerDistance) {
    bool isTip = (gl_VertexID + 1) % 5 == 0;
    float waveDistance = isTip ? tipDistance : centerDistance;
    return sin((uTime / uWaveSpeed) + waveSize) * waveDistance;
  }

  void main() {
    vPosition = position;
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);

    if (vPosition.y < 0.0) {
      vPosition.y = 0.0;
    } else {
      vPosition.x += wave(uv.x * 10.0, 0.3, 0.1);      
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  uniform sampler2D uCloud;

  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vNormal;

  // Darker blue-green color with a stronger blue tint
  vec3 darkBlueishGreen = vec3(0.05, 0.15, 0.3); // Reduced green, increased blue

  void main() {
    // Apply the blueish green color with vertical variation
    vec3 color = mix(darkBlueishGreen * 0.7, darkBlueishGreen, vPosition.y);

    // Mix with cloud texture for detail
    color = mix(color, texture2D(uCloud, vUv).rgb, 0.4);

    // Basic lighting to enhance the shading
    float lighting = normalize(dot(vNormal, vec3(10)));

    // Output the final color
    gl_FragColor = vec4(color + lighting * 0.03, 1.0);
  }
`;

const BLADE_WIDTH = 0.015;
const BLADE_HEIGHT = 0.2;
const BLADE_HEIGHT_VARIATION = 0.15;
const BLADE_VERTEX_COUNT = 5;
const BLADE_TIP_OFFSET = 0.025;

function interpolate(val, oldMin, oldMax, newMin, newMax) {
  return ((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
}

export class GrassGeometry extends THREE.BufferGeometry {
  constructor(size, count) {
    super();

    const positions = [];
    const uvs = [];
    const indices = [];

    for (let i = 0; i < count; i++) {
      const surfaceMin = (size / 2) * -1;
      const surfaceMax = size / 2;
      const radius = (size / 2) * Math.random();
      const theta = Math.random() * 2 * Math.PI;

      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);

      uvs.push(
        ...Array.from({ length: BLADE_VERTEX_COUNT }).flatMap(() => [
          interpolate(x, surfaceMin, surfaceMax, 0, 1),
          interpolate(y, surfaceMin, surfaceMax, 0, 1),
        ])
      );

      const blade = this.computeBlade([x, 0, y], i);
      positions.push(...blade.positions);
      indices.push(...blade.indices);
    }

    this.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(positions), 3)
    );
    this.setAttribute(
      'uv',
      new THREE.BufferAttribute(new Float32Array(uvs), 2)
    );
    this.setIndex(indices);
    this.computeVertexNormals();
  }

  computeBlade(center, index = 0) {
    const height = BLADE_HEIGHT + Math.random() * BLADE_HEIGHT_VARIATION;
    const vIndex = index * BLADE_VERTEX_COUNT;

    const yaw = Math.random() * Math.PI * 2;
    const yawVec = [Math.sin(yaw), 0, -Math.cos(yaw)];
    const bend = Math.random() * Math.PI * 2;
    const bendVec = [Math.sin(bend), 0, -Math.cos(bend)];

    const bl = yawVec.map((n, i) => n * (BLADE_WIDTH / 2) * 1 + center[i]);
    const br = yawVec.map((n, i) => n * (BLADE_WIDTH / 2) * -1 + center[i]);
    const tl = yawVec.map((n, i) => n * (BLADE_WIDTH / 4) * 1 + center[i]);
    const tr = yawVec.map((n, i) => n * (BLADE_WIDTH / 4) * -1 + center[i]);
    const tc = bendVec.map((n, i) => n * BLADE_TIP_OFFSET + center[i]);

    tl[1] += height / 2;
    tr[1] += height / 2;
    tc[1] += height;

    return {
      positions: [...bl, ...br, ...tr, ...tl, ...tc],
      indices: [
        vIndex,
        vIndex + 1,
        vIndex + 2,
        vIndex + 2,
        vIndex + 4,
        vIndex + 3,
        vIndex + 3,
        vIndex,
        vIndex + 2,
      ],
    };
  }
}

const cloudTexture = new THREE.TextureLoader().load('/pattern.png');
cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;

export class Grass extends THREE.Mesh {
  constructor(size, count) {
    const geometry = new GrassGeometry(size, count);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uCloud: { value: cloudTexture },
        uTime: { value: 0 },
        uWaveSpeed: { value: 2000 },
      },
      side: THREE.DoubleSide,
      vertexShader,
      fragmentShader,
    });
    super(geometry, material);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(15, 8).rotateX(Math.PI / 2),
      material
    );
    floor.position.y = -Number.EPSILON;
    this.add(floor);
  }

  update(time) {
    this.material.uniforms.uTime.value = time;
  }
}

export default Grass;
