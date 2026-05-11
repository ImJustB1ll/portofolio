"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ShowcaseModel } from './ShowcaseModel';

export function MasterScene() {
    const modelContainerRef = useRef<THREE.Group>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!modelContainerRef.current) return;

        // Build a GSAP timeline synced to the native DOM scroll sections
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#scroll-container",
                start: "top top",
                end: "bottom bottom",
                scrub: 1, // Smooth easing between scroll steps
            }
        });

        // Example Apple-style scrollytelling sequence: Rotates and moves closer
        tl.to(modelContainerRef.current.rotation, { y: Math.PI * 2, ease: "none" }, 0)
            .to(modelContainerRef.current.position, { z: 2, ease: "power1.inOut" }, 0);

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <group ref={modelContainerRef}>
            {/* Replace with a dynamic URL fetched from Supabase later */}
            <ShowcaseModel assetUrl="https://your-supabase-id.supabase.co/storage/v1/object/public/models/example.glb" />
        </group>
    );
}