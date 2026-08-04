'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

export default function PageTransition({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        gsap.fromTo(
            containerRef.current,
            { opacity: 0.8 },
            { opacity: 1, duration: 0.5, ease: 'power1.out' }
        );
    }, [pathname]);

    return <div ref={containerRef}>{children}</div>;
}