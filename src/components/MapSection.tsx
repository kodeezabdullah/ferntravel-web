'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const PAKISTAN_NORTH_CENTER: [number, number] = [74.8, 35.5];
const INITIAL_ZOOM = 6.2;

type MapStatus = 'loading' | 'ready' | 'error';

export default function MapSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [status, setStatus] = useState<MapStatus>(MAPBOX_TOKEN ? 'loading' : 'error');

  useEffect(() => {
    if (!containerRef.current || mapRef.current || !MAPBOX_TOKEN) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    let map: mapboxgl.Map;
    try {
      map = new mapboxgl.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: PAKISTAN_NORTH_CENTER,
        zoom: INITIAL_ZOOM,
      });
    } catch (err) {
      console.error('Mapbox init threw:', err);
      queueMicrotask(() => setStatus('error'));
      return;
    }
    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('load', () => {
      console.log('Mapbox map loaded successfully');
      map.resize();
      setStatus('ready');
    });

    map.on('error', (e) => {
      console.error('Mapbox error event:', e.error);
    });

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <section className="w-full bg-[#faf7f2] pb-24 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Heading */}
        <div className="mb-10">
          <h2
            className="text-[32px] md:text-[40px] font-bold text-[#3d3229] tracking-tight mb-2"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Explore The Map
          </h2>
          <p
            className="text-[#8a8a85] text-[15px] md:text-[16px]"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            See where your next trek begins and ends
          </p>
        </div>

        {/* Map */}
        <div
          className="relative w-full rounded-[24px] overflow-hidden border border-[#ede8dc] bg-[#eef3f0]"
          style={{ height: '480px' }}
        >
          <div
            ref={containerRef}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          />

          {status === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span
                className="text-[#8a8a85] text-[14px]"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Loading map…
              </span>
            </div>
          )}

          {status === 'error' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span
                className="text-[#8a8a85] text-[14px]"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Map unavailable right now.
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
