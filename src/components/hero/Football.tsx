"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { panelOrientations } from "./panel-orientations";

const AUTO_SPIN_SPEED = 0.0042;
const DRAG_YAW_SENSITIVITY = 0.012;
const DRAG_PITCH_SENSITIVITY = 0.008;

export function Football() {
  const groupRef = useRef<THREE.Group>(null);
  const velocity = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const panelQuaternions = useMemo(() => panelOrientations(), []);
  const { gl } = useThree();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    canvasRef.current = gl.domElement;
  }, [gl]);

  const baseSpeed = useMemo(() => {
    if (typeof window === "undefined") return AUTO_SPIN_SPEED;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : AUTO_SPIN_SPEED;
  }, []);

  useEffect(() => {
    velocity.current.y = baseSpeed;
  }, [baseSpeed]);

  useFrame(() => {
    const group = groupRef.current;
    if (!group || dragging.current) return;
    velocity.current.y += (baseSpeed - velocity.current.y) * 0.03;
    velocity.current.x *= 0.94;
    group.rotation.y += velocity.current.y;
    group.rotation.x += velocity.current.x;
  });

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.style.cursor = "grab";

    function handlePointerDown(event: PointerEvent) {
      dragging.current = true;
      lastPointer.current = { x: event.clientX, y: event.clientY };
      canvas.style.cursor = "grabbing";
    }

    function handlePointerMove(event: PointerEvent) {
      if (!dragging.current || !groupRef.current) return;
      const dx = event.clientX - lastPointer.current.x;
      const dy = event.clientY - lastPointer.current.y;
      lastPointer.current = { x: event.clientX, y: event.clientY };
      groupRef.current.rotation.y += dx * DRAG_YAW_SENSITIVITY;
      groupRef.current.rotation.x += dy * DRAG_PITCH_SENSITIVITY;
      velocity.current = { x: dy * DRAG_PITCH_SENSITIVITY, y: dx * DRAG_YAW_SENSITIVITY };
    }

    function handlePointerUp() {
      dragging.current = false;
      canvas.style.cursor = "grab";
    }

    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, []);

  return (
    <group ref={groupRef} rotation-z={0.2}>
      <mesh>
        <sphereGeometry args={[1, 72, 48]} />
        <meshPhysicalMaterial
          color={0xe9e9ee}
          roughness={0.58}
          metalness={0}
          clearcoat={0.35}
          clearcoatRoughness={0.55}
          sheen={0.4}
          sheenRoughness={0.7}
        />
      </mesh>
      {panelQuaternions.map((quaternion, index) => (
        <mesh key={index} quaternion={quaternion}>
          <sphereGeometry args={[1.006, 32, 8, 0, Math.PI * 2, 0, 0.3]} />
          <meshStandardMaterial color={0x14151b} roughness={0.62} metalness={0.05} />
        </mesh>
      ))}
    </group>
  );
}
