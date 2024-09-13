/* eslint-disable react/no-unknown-property */
import HomeScene from '@/components/HomeScene';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';

export function HomePage() {
  return (
    <div className="h-screen w-full">
      <Canvas
        className="h-screen"
        shadows
        camera={{
          position: [3, 0.5, 1],
          fov: 30,
        }}
      >
        <Environment files="3d-render-tree-landscape-against-night-sky.hdr" />
        <color attach="background" args={['#0b2351']} />
        <HomeScene />
      </Canvas>
    </div>
  );
}
