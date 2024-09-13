import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import Grass from './Grass';
import { useThree } from '@react-three/fiber';

function GrassScene() {
  const grassRef = useRef();
  const { scene } = useThree();

  useEffect(() => {
    const grass = new Grass(30, 100000);
    grassRef.current = grass;
    scene.add(grass);

    return () => {
      scene.remove(grass);
    };
  }, [scene]);

  useFrame(({ clock }) => {
    if (grassRef.current) {
      grassRef.current.update(clock.getElapsedTime() * 1000);
    }
  });

  return null;
}

export default GrassScene;
