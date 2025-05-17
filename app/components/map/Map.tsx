'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Updated to use Natural Earth dataset
const COUNTRIES_GEOJSON_URL =
  'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson';

// Animation durations
const ANIMATION_DURATION = 300; // ms

export default function Map() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const selectedLayerRef = useRef<L.Path | null>(null);
  const hoverLayerRef = useRef<L.Path | null>(null);

  // Initialize map and GeoJSON layer
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map with improved settings
    const map = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 2,
      zoomControl: false,
      attributionControl: false,
      minZoom: 1.5,
      maxZoom: 19,
      doubleClickZoom: false,
      scrollWheelZoom: true,
      touchZoom: true,
      dragging: true,
      keyboard: true,
      zoomSnap: 0.5,
      zoomDelta: 0.5,
      maxBounds: [
        [-90, -180], // Southwest coordinates
        [90, 180], // Northeast coordinates
      ],
      maxBoundsViscosity: 1.0,
      // Improved touch settings
      bounceAtZoomLimits: false,
      // Improved performance
      preferCanvas: true,
    });

    // Add dark theme tile layer with improved settings
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      minZoom: 1.5,
      noWrap: true,
      crossOrigin: true,
      detectRetina: true,
      subdomains: 'abcd',
      // Improved performance
      updateWhenIdle: true,
      updateWhenZooming: false,
    }).addTo(map);

    // Force the map to stay full screen with improved handling
    const forceFullScreen = () => {
      const container = mapContainerRef.current;
      if (container) {
        container.style.width = '100%';
        container.style.height = '100%';
        map.invalidateSize();
      }
    };

    // Call on mount and window resize with debounce
    let resizeTimeout: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(forceFullScreen, 100);
    };

    forceFullScreen();
    window.addEventListener('resize', debouncedResize);

    // Add zoom control with custom position and styling
    const zoomControl = L.control
      .zoom({
        position: 'bottomright',
        zoomInText: '+',
        zoomOutText: '-',
      })
      .addTo(map);

    // Style zoom controls
    const zoomControlContainer = zoomControl.getContainer();
    if (zoomControlContainer) {
      zoomControlContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      zoomControlContainer.style.border = 'none';
      zoomControlContainer.style.borderRadius = '4px';
    }

    mapRef.current = map;

    // Wait for map to be ready before adding layers
    map.whenReady(() => {
      // Fetch and add country polygons with improved styling
      fetch(COUNTRIES_GEOJSON_URL)
        .then((res) => res.json())
        .then((geojson) => {
          const geoJsonLayer = L.geoJSON(geojson, {
            style: {
              color: '#ffffff',
              weight: 1,
              fillOpacity: 0,
              opacity: 0.8,
            },
            onEachFeature: (feature, layer) => {
              // Add smooth transitions using CSS classes instead
              const element = (layer as L.Path).getElement();
              if (element) {
                element.classList.add('transition-all', 'duration-300', 'ease-in-out');
              }

              layer.on({
                mouseover: (e) => {
                  const layer = e.target;
                  if (layer !== selectedLayerRef.current) {
                    // Store hover layer for cleanup
                    hoverLayerRef.current = layer;

                    // Smooth hover effect
                    layer.setStyle({
                      color: '#ffffff',
                      weight: 2,
                      opacity: 1,
                    });
                  }
                  layer.bringToFront();
                },
                mouseout: (e) => {
                  const layer = e.target;
                  if (layer !== selectedLayerRef.current) {
                    // Reset hover effect
                    layer.setStyle({
                      color: '#ffffff',
                      weight: 1,
                      opacity: 0.8,
                    });
                    hoverLayerRef.current = null;
                  }
                },
                click: (e) => {
                  const layer = e.target;

                  // Reset previous selection with smooth transition
                  if (selectedLayerRef.current) {
                    selectedLayerRef.current.setStyle({
                      color: '#ffffff',
                      weight: 1,
                      opacity: 0.8,
                    });
                  }

                  // If clicking the same country, deselect it
                  if (selectedLayerRef.current === layer) {
                    selectedLayerRef.current = null;
                  } else {
                    // Select new country with smooth transition
                    layer.setStyle({
                      color: '#00ff00',
                      weight: 2,
                      opacity: 1,
                    });
                    selectedLayerRef.current = layer;
                  }
                },
              });
            },
          }).addTo(map);

          geoJsonLayerRef.current = geoJsonLayer;
        });
    });

    // Cleanup with improved handling
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimeout);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      geoJsonLayerRef.current = null;
      selectedLayerRef.current = null;
      hoverLayerRef.current = null;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-0"
    >
      <div
        ref={mapContainerRef}
        className="w-full h-full touch-none"
        style={{
          touchAction: 'none',
          // Improved mobile handling
          WebkitTapHighlightColor: 'transparent',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
        }}
      />
    </motion.div>
  );
}
