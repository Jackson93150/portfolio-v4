/* eslint-disable react/no-unknown-property */
import { OrbitControls, Plane, Text3D } from '@react-three/drei';
import { useLoader, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef, useState } from 'react';
import GrassScene from './GrassScene';
import { Avatar } from './Avatar';
import { House } from './House';
import { Lantern } from './Lantern';

export default function HomeScene() {
  const texture = useLoader(THREE.TextureLoader, '/space2bis.jpg');
  const planeRef = useRef();
  const spotLightRef = useRef();
  const [startTime] = useState(Date.now());
  const duration = 2 * 60 * 1000;

  // useHelper(spotLightRef, THREE.SpotLightHelper);

  useFrame(() => {
    if (planeRef.current) {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);

      const newY = THREE.MathUtils.lerp(2.2, 1.5, t);
      const newZ = THREE.MathUtils.lerp(5, 3, t);

      planeRef.current.position.y = newY;
      planeRef.current.position.z = newZ;
    }
  });

  return (
    <>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <spotLight
        ref={spotLightRef}
        position={[0, 1.2, 1.9]}
        intensity={10}
        angle={Math.PI / 3}
        penumbra={0.5}
        castShadow
      />
      <GrassScene />
      <Avatar />
      <House />
      <Lantern />
      {'JACKSON'.split('').map((letter, index) => (
        <Text3D
          key={index}
          position={[0.02, 0.75 - index * 0.07, 1.965]}
          scale={[0.06, 0.06, 0.06]}
          font={'font/hachimaki.json'}
          material-color="black"
          rotation={[0, -Math.PI / 1, 0]}
        >
          {letter}
        </Text3D>
      ))}
      <Plane
        ref={planeRef}
        args={[17, 10]}
        position={[-6, 2.2, 5]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <meshStandardMaterial map={texture} />
      </Plane>
    </>
  );
}
