"use client";

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ShowcaseModel } from './ShowcaseModel';

interface MasterSceneProps {
    initialModelUrl: string;
}

export function MasterScene({ initialModelUrl }: MasterSceneProps) {
    const modelContainerRef = useRef<THREE.Group>(null);
    const [currentModelUrl, setCurrentModelUrl] = useState<string>(initialModelUrl);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        let ctx: gsap.Context;

        // Create a function to safely initialize GSAP once DOM sections exist
        const initAnimation = (sections: HTMLElement[]) => {
            if (!modelContainerRef.current) return;

            // Set precise initial state from the first node safely
            try {
                const initPos = JSON.parse(sections[0].dataset.position || '[0,0,0]');
                const initRot = JSON.parse(sections[0].dataset.rotation || '[0,0,0]');
                modelContainerRef.current.position.set(initPos[0], initPos[1], initPos[2]);
                modelContainerRef.current.rotation.set(initRot[0], initRot[1], initRot[2]);
            } catch (err) {
                console.error("Failed to parse initial targets", err);
            }

            // Wrap timeline in gsap.context for bulletproof React 19 cleanup
            ctx = gsap.context(() => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: "#scroll-container",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 1,
                    }
                });

                sections.forEach((section, index) => {
                    if (index === 0) return;

                    try {
                        const targetPos = JSON.parse(section.dataset.position || '[0,0,0]');
                        const targetRot = JSON.parse(section.dataset.rotation || '[0,0,0]');

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

                        // Optional: Add ScrollTrigger callbacks to dynamically update the model URL if needed
                        ScrollTrigger.create({
                            trigger: section,
                            start: "top center",
                            onEnter: () => {
                                const nextUrl = section.dataset.modelUrl;
                                if (nextUrl && nextUrl !== currentModelUrl) {
                                    setCurrentModelUrl(nextUrl);
                                }
                            },
                            onEnterBack: () => {
                                const prevUrl = section.dataset.modelUrl;
                                if (prevUrl && prevUrl !== currentModelUrl) {
                                    setCurrentModelUrl(prevUrl);
                                }
                            }
                        });

                    } catch (err) {
                        console.error(`Error animating section ${index}:`, err);
                    }
                });
            });
        };

        // Polling/Observer mechanism to guarantee DOM elements are ready before binding GSAP
        const checkForDOM = () => {
            const nodes = gsap.utils.toArray<HTMLElement>('.gsap-section');
            if (nodes.length > 0) {
                initAnimation(nodes);
            } else {
                // If DOM isn't hydrated yet, check again in 50ms
                setTimeout(checkForDOM, 50);
            }
        };

        checkForDOM();

        // Complete, aggressive cleanup killing the context, timeline, and all triggers cleanly
        return () => {
            if (ctx) ctx.revert();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [currentModelUrl]);

    return (
        <group ref={modelContainerRef}>
            {currentModelUrl && <ShowcaseModel assetUrl={currentModelUrl} />}
        </group>
    );
}