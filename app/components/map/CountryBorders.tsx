'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { GeoJSON } from 'geojson';

interface CountryBordersProps {
  map: L.Map | null;
}

export default function CountryBorders({ map }: CountryBordersProps) {
  const bordersRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    if (!map) return;

    // Wait for map to be ready before adding layers
    map.whenReady(() => {
      // Load GeoJSON data
      fetch('/data/countries.geojson')
        .then((response) => response.json())
        .then((data: GeoJSON) => {
          // Create GeoJSON layer with custom styling
          bordersRef.current = L.geoJSON(data, {
            style: (feature) => {
              if (!feature?.properties?.name)
                return {
                  color: '#ffffff',
                  weight: 1,
                  fillColor: '#1a1a1a',
                  fillOpacity: 0.3,
                };

              return {
                color: '#ffffff',
                weight: 1,
                fillColor: '#1a1a1a',
                fillOpacity: 0.3,
              };
            },
            onEachFeature: (feature, layer) => {
              // Add hover effect
              layer.on({
                mouseover: (e) => {
                  const layer = e.target;
                  layer.setStyle({
                    color: '#ffffff',
                    weight: 2,
                    fillOpacity: 0.5,
                    fillColor: '#2a2a2a',
                  });
                  layer.bringToFront();
                },
                mouseout: (e) => {
                  bordersRef.current?.resetStyle(e.target);
                },
                click: (e) => {
                  // Handle country selection
                  const countryName = feature.properties?.name;
                  console.log('Selected country:', countryName);

                  // Highlight the selected country
                  bordersRef.current?.eachLayer((layer) => {
                    if (layer instanceof L.Path) {
                      layer.setStyle({
                        color: '#ffffff',
                        weight: 1,
                        fillOpacity: 0.3,
                        fillColor: '#1a1a1a',
                      });
                    }
                  });

                  e.target.setStyle({
                    color: '#00ff00',
                    weight: 2,
                    fillOpacity: 0.5,
                    fillColor: '#2a2a2a',
                  });
                },
              });
            },
          }).addTo(map);

          // Bring borders to front
          bordersRef.current.bringToFront();
        })
        .catch((error) => {
          console.error('Error loading country borders:', error);
        });
    });

    return () => {
      if (bordersRef.current) {
        bordersRef.current.remove();
      }
    };
  }, [map]);

  return null;
}
