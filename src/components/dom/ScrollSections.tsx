// src/components/dom/ScrollSections.tsx
"use client";

import React from 'react';
import { Database } from '@/types/database.types';

type Project = Database['public']['Tables']['projects']['Row'];

interface ScrollSectionsProps {
    projects: Project[];
}

export function ScrollSections({ projects }: ScrollSectionsProps) {
    return (
        <>
            {projects.map((project, index) => {
                // Alternate text sides for an Apple-style presentation flow
                const isEven = index % 2 === 0;

                return (
                    <section
                        key={project.id}
                        className="gsap-section h-screen flex items-center p-12 lg:p-24 relative z-10"
                        // Attach coordinates directly to the DOM for GSAP ScrollTrigger to read
                        data-position={JSON.stringify(project.target_position)}
                        data-rotation={JSON.stringify(project.target_rotation)}
                        data-model-url={project.model_url}
                    >
                        <div className={`max-w-xl w-full ${isEven ? 'mr-auto text-left' : 'ml-auto text-right'}`}>
                            <span className="text-xs font-mono uppercase tracking-widest text-gray-500 block mb-2">
                                0{project.order_index} // Showcase
                            </span>
                            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
                                {project.title}
                            </h2>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                {project.description}
                            </p>
                        </div>
                    </section>
                );
            })}
        </>
    );
}