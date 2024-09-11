/* eslint-disable react/no-unknown-property */
import { OrbitControls } from '@react-three/drei';

import { Avatar } from './Avatar';

export default function HomeScene() {
  return (
    <>
      <OrbitControls />
      <Avatar />
    </>
  );
}
