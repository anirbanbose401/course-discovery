'use client';

import React, { useState, useEffect } from 'react';

interface CountUpProps {
    end: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
}

export default function CountUp({ end, duration = 2000, suffix = '', prefix = '' }: CountUpProps) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        let animationFrameId: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            // Easing function (easeOutCubic)
            const easeOut = (x: number): number => {
                return 1 - Math.pow(1 - x, 3);
            };

            setCount(Math.floor(easeOut(percentage) * end));

            if (progress < duration) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [end, duration]);

    return (
        <span>
            {prefix}{count}{suffix}
        </span>
    );
}
