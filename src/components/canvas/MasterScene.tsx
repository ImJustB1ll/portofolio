"use client";

import { useEffect, useRef, useState } from 'react';
// 1. Import THREE normally — no separate addon import needed for Timer anymore!
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

    // 2. Access Timer straight from the core THREE namespace
    const timerRef = useRef<THREE.Timer | null>(null);

    useEffect(() => {
        // 3. Initialize the core Timer instance
        const timer = new THREE.Timer();
        timerRef.current = timer;

        // Connect the timer to the document to enable the Page Visibility API.
        // Pauses time accumulation when the user switches tabs or minimizes the browser.
        timer.connect(document);

        gsap.registerPlugin(ScrollTrigger);
        let ctx: gsap.Context;
        let animationFrameId: number;

        // Imperative timing loop receiving the native high-resolution timestamp
        const updateTick = (timestamp: number) => {
            animationFrameId = requestAnimationFrame(updateTick);

            // Forward the native frame timestamp directly to the update method
            timer.update(timestamp);

            // Safely read the uniform delta and elapsed time without race conditions
            const delta = timer.getDelta();
            const elapsed = timer.getElapsed();

            // Example: Smooth custom floating/idle effect driven by the timer's precise elapsed time
            if (modelContainerRef.current) {
                modelContainerRef.current.position.y += Math.sin(elapsed * 2) * delta * 0.1;
            }
        };

        const initAnimation = (sections: HTMLElement[]) => {
            if (!modelContainerRef.current) return;

            try {
                const initPos = JSON.parse(sections[0].dataset.position || '[0,0,0]');
                const initRot = JSON.parse(sections[0].dataset.rotation || '[0,0,0]');
                modelContainerRef.current.position.set(initPos[0], initPos[1], initPos[2]);
                modelContainerRef.current.rotation.set(initRot[0], initRot[1], initRot[2]);
            } catch (err) {
                console.error("Failed to parse initial targets", err);
            }

            // Start the custom timing loop, passing performance.now() as the initial kickoff
            updateTick(performance.now());

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

        const checkForDOM = () => {
            const nodes = gsap.utils.toArray<HTMLElement>('.gsap-section');
            if (nodes.length > 0) {
                initAnimation(nodes);
            } else {
                setTimeout(checkForDOM, 50);
            }
        };

        checkForDOM();

        // 4. Complete cleanup adhering to the official Timer API lifecycle
        return () => {
            cancelAnimationFrame(animationFrameId);
            if (ctx) ctx.revert();
            ScrollTrigger.getAll().forEach(t => t.kill());

            // Disconnect DOM listeners (Page Visibility) and dispose of internal resources safely
            timer.disconnect();
            timer.dispose();
            timerRef.current = null;
        };
    }, [currentModelUrl]);

    return (
        <group ref={modelContainerRef}>
            {currentModelUrl && <ShowcaseModel assetUrl={currentModelUrl} />}
        </group>
    );
}