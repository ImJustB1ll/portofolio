// src/components/canvas/MasterScene.tsx
"use client";

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ShowcaseModel } from './ShowcaseModel';

export function MasterScene() {
    const modelContainerRef = useRef<THREE.Group>(null);
    // Fallback to a placeholder or dynamically load your initial asset URL
    const [currentModelUrl, setCurrentModelUrl] = useState<string>(
        "https://atzuwmewmcrvldfklsis.supabase.co/storage/v1/object/public/models/test-model.glb"
    );

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!modelContainerRef.current) return;

        const sections = gsap.utils.toArray<HTMLElement>('.gsap-section');
        if (sections.length === 0) return;

        // Set the initial starting position based on the first DOM section
        try {
            const initPos = JSON.parse(sections[0].dataset.position || '[0,0,0]');
            const initRot = JSON.parse(sections[0].dataset.rotation || '[0,0,0]');
            modelContainerRef.current.position.set(initPos[0], initPos[1], initPos[2]);
            modelContainerRef.current.rotation.set(initRot[0], initRot[1], initRot[2]);

            const initUrl = sections[0].dataset.modelUrl;
            if (initUrl) setCurrentModelUrl(initUrl);
        } catch (err) {
            console.error("Failed to parse initial GSAP targets", err);
        }

        // Create an overarching timeline synced to the scroll container
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#scroll-container",
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
            }
        });

        // Loop through each subsequent section and map animations step-by-step
        sections.forEach((section, index) => {
            if (index === 0) return; // Skip the first section since it's our start state

            try {
                const targetPos = JSON.parse(section.dataset.position || '[0,0,0]');
                const targetRot = JSON.parse(section.dataset.rotation || '[0,0,0]');

                // Animate the group ref to the target coordinates cleanly
                tl.to(modelContainerRef.current!.position, {
                    x: targetPos[0],
                    y: targetPos[1],
                    z: targetPos[2],
                    ease: "power2.inOut"
                }, "label_" + index)
                    .to(modelContainerRef.current!.rotation, {
                        x: targetRot[0],
                        y: targetRot[1],
                        z: targetRot[2],
                        ease: "power2.inOut"
                    }, "label_" + index);

            } catch (err) {
                console.error(`Error animating section ${index}:`, err);
            }
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <group ref={modelContainerRef}>
            {currentModelUrl && <ShowcaseModel assetUrl={currentModelUrl} />}
        </group>
    );
}