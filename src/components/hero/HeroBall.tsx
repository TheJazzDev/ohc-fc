"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Football } from "./Football";

export function HeroBall() {
  return (
    <Canvas
      camera={{ fov: 32, position: [0, 0.15, 3.6] }}
      dpr={[1, 2]}
      gl={{
        alpha: true,
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      style={{ touchAction: "none", filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.4))" }}
    >
      <directionalLight color={0xffffff} intensity={3.2} position={[-3, 5, 3]} />
      <directionalLight color={0xcdf542} intensity={3.4} position={[2.5, -0.5, -3]} />
      <directionalLight color={0xcdf542} intensity={1.2} position={[-2, -2, -2.5]} />
      <hemisphereLight color={0x6d7591} groundColor={0x0b0b10} intensity={0.35} />
      <Football />
    </Canvas>
  );
}
