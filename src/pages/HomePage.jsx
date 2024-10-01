/* eslint-disable react/no-unknown-property */
import { Canvas } from '@react-three/fiber';
import { useRef } from 'react';
import { getProject } from '@theatre/core';
import { SheetProvider, editable } from '@theatre/r3f';
import studio from '@theatre/studio';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import HomeScene from '@/components/HomeScene';

studio.initialize();

const cameraSheet = getProject('CameraAnimationProject').sheet('CameraSheet');

const EditableCamera = editable(PerspectiveCamera, 'perspectiveCamera');

export function HomePage() {
  return (
    <div className="h-screen w-full">
      <Canvas className="h-screen" shadows>
        <SheetProvider sheet={cameraSheet}>
          <Environment files="3d-render-tree-landscape-against-night-sky.hdr" />
          <color attach="background" args={['#0b2351']} />
          <HomeScene />
          <AnimatedCamera />
        </SheetProvider>
      </Canvas>
    </div>
  );
}

function AnimatedCamera() {
  const cameraRef = useRef();

  return (
    <EditableCamera
      theatreKey="Camera"
      makeDefault
      ref={cameraRef}
      position={[3, 0.5, 1]}
      fov={30}
    />
  );
}
