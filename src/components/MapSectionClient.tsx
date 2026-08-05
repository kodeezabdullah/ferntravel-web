'use client';

import dynamic from 'next/dynamic';

const MapSection = dynamic(() => import('@/components/MapSection'), { ssr: false });

export default MapSection;
