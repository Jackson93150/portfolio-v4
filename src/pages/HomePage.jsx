/* eslint-disable react/no-unknown-property */
import HomeScene from '@/components/HomeScene';
import { Canvas } from '@react-three/fiber';

export function HomePage() {
  return (
    <div className="h-screen w-full">
      <Canvas
        className="h-screen"
        shadows
        camera={{
          position: [10, 0, 0],
          fov: 30,
        }}
      >
        <ambientLight intensity={1.5} />
        <color attach="background" args={['#213040']} />
        <HomeScene />
      </Canvas>
    </div>
  );
}
