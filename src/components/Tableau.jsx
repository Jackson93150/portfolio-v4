/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.2 tableau.glb 
*/
/* eslint-disable react/no-unknown-property */

import React from 'react';
import { useGLTF } from '@react-three/drei';

export function Tableau(props) {
  const { nodes, materials } = useGLTF('models/tableau.glb');
  return (
    <group {...props} dispose={null}>
      <group
        position={[-5, 1.3, -0.855]}
        rotation={[0.01, 0, Math.PI / 2]}
        scale={0.3}
      >
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group rotation={[1.565, 1.56, 1.565]}>
            <mesh
              geometry={nodes.cadre_lowpoly_blinn2_0_1.geometry}
              material={materials.blinn2}
            />
            <mesh
              geometry={nodes.cadre_lowpoly_blinn2_0_2.geometry}
              material={materials['Material.001']}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('models/tableau.glb');
