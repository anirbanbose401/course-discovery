'use client';

import React, { useEffect, useRef, useState } from 'react';

interface FadeInSectionProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

export default function FadeInSection({
    children,
    delay = 0,
    className = '',
}: FadeInSectionProps) {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Once visible, we can stop observing to ensure it only triggers once
                    if (domRef.current) {
                        observer.unobserve(domRef.current);
                    }
                }
            });
        });

        const currentRef = domRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <div
            ref={domRef}
            className={`transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
