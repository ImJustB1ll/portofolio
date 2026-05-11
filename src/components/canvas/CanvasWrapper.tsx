"use client";

import { Canvas } from '@react-three/fiber';
import { MasterScene } from './MasterScene';

export function CanvasWrapper() {
    return (
        <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                dpr={[1, 2]} // Caps pixel ratio at 2 for optimal mobile performance
            >
                <directionalLight position={[10, 10, 5]} intensity={1.5} />
                <ambientLight intensity={0.5} />
                <MasterScene />
            </Canvas>
        </div>
    );
}