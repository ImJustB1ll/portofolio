"use client";

import { Canvas } from '@react-three/fiber';
import { MasterScene } from './MasterScene';

interface CanvasWrapperProps {
    initialModelUrl: string;
}

export function CanvasWrapper({ initialModelUrl }: CanvasWrapperProps) {
    return (
        /* Note: pointer-events-none prevents user interaction (orbit controls/clicking). Keep this if pure scroll-driven visualization is desired. */
        <div className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                dpr={[1, 2]}
            >
                <directionalLight position={[10, 10, 5]} intensity={1.5} />
                <ambientLight intensity={0.5} />
                <MasterScene initialModelUrl={initialModelUrl} />
            </Canvas>
        </div>
    );
}