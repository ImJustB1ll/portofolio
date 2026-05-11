"use client";

import { useGLTF } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

interface ShowcaseModelProps {
    assetUrl: string;
}

export function ShowcaseModel({ assetUrl }: ShowcaseModelProps) {
    const groupRef = useRef<THREE.Group>(null);

    // Explicit trailing slash guarantees correct WASM path concatenation
    const { scene } = useGLTF(assetUrl, '/draco/');

    return (
        <group ref={groupRef} dispose={null}>
            <primitive object={scene} />
        </group>
    );
}