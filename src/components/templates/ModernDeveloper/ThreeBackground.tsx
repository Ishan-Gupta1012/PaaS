"use client";
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';

const AnimatedShape = () => {
  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <Sphere args={[1.5, 64, 64]}>
        <MeshDistortMaterial 
          color="#ccff00" 
          attach="material" 
          distort={0.4} 
          speed={2} 
          roughness={0.2}
          metalness={0.8}
          wireframe={true}
        />
      </Sphere>
    </Float>
  );
};

export const ThreeBackground = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-100 mix-blend-screen">
      <Canvas camera={{ position: [0, 0, 6] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={3} color="#ccff00" />
        <pointLight position={[-10, -10, -10]} intensity={2} color="#ffffff" />
        <Stars radius={50} depth={50} count={500} factor={2} saturation={0} fade speed={1} />
        <AnimatedShape />
      </Canvas>
    </div>
  );
};
