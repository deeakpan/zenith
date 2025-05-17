'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { StepProps } from '../types';
import { COUNTRY_CATEGORIES, COUNTRY_DATA } from '@/app/constants/countryCategories';

// Updated to use Natural Earth dataset
const COUNTRIES_GEOJSON_URL = 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson';

interface RegionSelectionStepProps extends StepProps {
  onNext: (data: { regions: string[], totalArea: number, totalPrice: number }) => void;
  onBack: () => void;
}

interface SelectedRegion {
  name: string;
  category: string;
  area: number;
}

export default function RegionSelectionStep({ onNext, onBack }: RegionSelectionStepProps) {
  const [selectedRegions, setSelectedRegions] = useState<SelectedRegion[]>([]);
  const [totalArea, setTotalArea] = useState(0);
  const [isExceedingLimit, setIsExceedingLimit] = useState(false);

  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const selectedLayerRef = useRef<L.Path | null>(null);
  const hoverLayerRef = useRef<L.Path | null>(null);

  const calculateTotalArea = useCallback((regions: SelectedRegion[]) => {
    return regions.reduce((sum, region) => sum + region.area, 0);
  }, []);

  const calculateCost = useCallback((regions: SelectedRegion[]) => {
    return regions.reduce((total, region) => {
      // All regions cost $0.4 per 1M km²
      return total + (region.area / 1000000) * 0.4;
    }, 0);
  }, []);

  // Validate country selection based on area rules
  const validateCountrySelection = useCallback((regions: SelectedRegion[]): boolean => {
    // Check if we have any sovereign regions
    const hasSovereign = regions.some(r => r.category === COUNTRY_CATEGORIES.SOVEREIGN);
    
    // If we have a sovereign region, we can't have any other regions
    if (hasSovereign && regions.length > 1) return false;
    
    // For non-sovereign regions, check total area
    const nonSovereignRegions = regions.filter(r => r.category !== COUNTRY_CATEGORIES.SOVEREIGN);
    const totalArea = calculateTotalArea(nonSovereignRegions);
    
    return totalArea <= 6000000; // 6M km² limit
  }, [calculateTotalArea]);

  // Initialize map and GeoJSON layer
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map with improved settings
    const map = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 1.5,
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
        [-90, -180],
        [90, 180]
      ],
      maxBoundsViscosity: 1.0,
      bounceAtZoomLimits: false,
      preferCanvas: true
    });

    // Update the tile layer to use a CORS-friendly source
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 1.5,
      noWrap: true,
      crossOrigin: true,
      detectRetina: true,
      subdomains: 'abc',
      updateWhenIdle: true,
      updateWhenZooming: false,
      attribution: '&copy; OpenStreetMap contributors'
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

    const zoomControl = L.control.zoom({
      position: 'bottomright',
      zoomInText: '+',
      zoomOutText: '-'
    }).addTo(map);

    const zoomControlContainer = zoomControl.getContainer();
    if (zoomControlContainer) {
      zoomControlContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      zoomControlContainer.style.border = 'none';
      zoomControlContainer.style.borderRadius = '4px';
    }

    mapRef.current = map;

    // Wait for map to be ready before adding layers
    map.whenReady(() => {
      fetch(COUNTRIES_GEOJSON_URL)
        .then(res => res.json())
        .then((geojson) => {
          const geoJsonLayer = L.geoJSON(geojson, {
            style: (feature) => {
              const isSelected = selectedRegions.some(r => r.name === feature?.properties?.name);
              return {
                color: isSelected ? '#22c55e' : '#ffffff',
                weight: isSelected ? 2 : 1,
                fillColor: isSelected ? '#22c55e' : '#1a1a1a',
                fillOpacity: isSelected ? 0.5 : 0.3
              };
            },
            onEachFeature: (feature, layer) => {
              const element = (layer as L.Path).getElement();
              if (element) {
                element.classList.add('transition-all', 'duration-300', 'ease-in-out');
              }

              layer.on({
                mouseover: (e) => {
                  const layer = e.target;
                  const isSelected = selectedRegions.some(r => r.name === feature.properties.name);
                  if (!isSelected) {
                    layer.setStyle({
                      color: '#ffffff',
                      weight: 2,
                      fillColor: '#1a1a1a',
                      fillOpacity: 0.4
                    });
                  }
                  layer.bringToFront();
                },
                mouseout: (e) => {
                  const layer = e.target;
                  const isSelected = selectedRegions.some(r => r.name === feature.properties.name);
                  if (!isSelected) {
                    layer.setStyle({
                      color: '#ffffff',
                      weight: 1,
                      fillColor: '#1a1a1a',
                      fillOpacity: 0.3
                    });
                  }
                },
                click: (e) => {
                  const layer = e.target;
                  const regionName = feature.properties.name;
                  const countryData = COUNTRY_DATA[regionName];
                  if (!countryData) {
                    console.log('Country not found:', regionName); // Debug log
                    return;
                  }

                  // If clicking the same country, deselect it
                  const isSelected = selectedRegions.some(r => r.name === regionName);
                  if (isSelected) {
                    // Remove from selected regions
                    const newSelection = selectedRegions.filter(r => r.name !== regionName);
                    setSelectedRegions(newSelection);
                    setTotalArea(calculateTotalArea(newSelection));
                    setIsExceedingLimit(false);
                  } else {
                    // Create potential new selection
                    const potentialSelection = [...selectedRegions, { 
                      name: regionName, 
                      category: countryData.category, 
                      area: countryData.area 
                    }];

                    // Validate the potential selection
                    if (validateCountrySelection(potentialSelection)) {
                      setSelectedRegions(potentialSelection);
                      setTotalArea(calculateTotalArea(potentialSelection));
                      setIsExceedingLimit(false);
                    } else {
                      // Only show error if we're actually trying to add a new country
                      setIsExceedingLimit(true);
                      // Reset the error after 4 seconds
                      setTimeout(() => setIsExceedingLimit(false), 4000);
                    }
                  }
                }
              });
            }
          }).addTo(map);
          
          geoJsonLayerRef.current = geoJsonLayer;
        });
    });

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
  }, [selectedRegions, validateCountrySelection, calculateTotalArea]);

  // Add a ref to store the current map view
  const mapViewRef = useRef<{ center: [number, number], zoom: number } | null>(null);

  // Save map view when it changes
  useEffect(() => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      const zoom = mapRef.current.getZoom();
      mapViewRef.current = { center: [center.lat, center.lng], zoom };
    }
  }, [selectedRegions]);

  // Restore map view after selection changes
  useEffect(() => {
    if (mapRef.current && mapViewRef.current) {
      mapRef.current.setView(mapViewRef.current.center, mapViewRef.current.zoom, { animate: false });
    }
  }, [selectedRegions]);

  // Separate effect for updating styles
  useEffect(() => {
    if (!geoJsonLayerRef.current) return;

    // Update styles for all layers based on current selection
    geoJsonLayerRef.current.eachLayer((layer) => {
      if (layer instanceof L.Path) {
        const props = (layer as any).feature?.properties;
        if (props?.name) {
          const isSelected = selectedRegions.some(r => r.name === props.name);
          layer.setStyle({
            color: isSelected ? '#22c55e' : '#ffffff',
            weight: isSelected ? 2 : 1,
            fillColor: isSelected ? '#22c55e' : '#1a1a1a',
            fillOpacity: isSelected ? 0.5 : 0.3
          });
        }
      }
    });
  }, [selectedRegions]);

  const handleRegionSelection = (regions: string[]) => {
    const regionAreas: { [key: string]: number } = {
      'Finland': 338424,
      'Sweden': 450295,
      'Norway': 385207,
      'Denmark': 43094,
      'Iceland': 103000,
      'Estonia': 45227,
      'Latvia': 64589,
      'Lithuania': 65300,
      'Poland': 312696,
      'Germany': 357022,
      'Netherlands': 41543,
      'Belgium': 30528,
      'Luxembourg': 2586,
      'France': 551695,
      'Spain': 505990,
      'Portugal': 92212,
      'Italy': 301340,
      'Switzerland': 41285,
      'Austria': 83879,
      'Czech Republic': 78867,
      'Slovakia': 49035,
      'Hungary': 93030,
      'Slovenia': 20273,
      'Croatia': 56594,
      'Romania': 238397,
      'Bulgaria': 110879,
      'Greece': 131957,
      'Albania': 28748,
      'North Macedonia': 25713
    };

    const totalArea = regions.reduce((sum, region) => sum + (regionAreas[region] || 0), 0);
    const totalPrice = (totalArea / 1000000) * 0.4;

    onNext({
      regions,
      totalArea,
      totalPrice
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      <div className="relative h-[400px] rounded-lg overflow-hidden border border-white/10">
        <div
          ref={mapContainerRef}
          className="w-full h-full touch-none"
          style={{ 
            touchAction: 'none',
            WebkitTapHighlightColor: 'transparent',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }}
        />
      </div>

      <div className="bg-zinc-800/50 p-4 rounded-lg space-y-3">
        <h3 className="text-lg font-medium text-white">Selected Regions</h3>
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {selectedRegions.map(region => (
            <div
              key={region.name}
              className="flex items-center justify-between p-2 bg-zinc-700/50 rounded"
            >
              <div>
                <span className="text-white">{region.name}</span>
                <span className="text-zinc-400 text-sm ml-2">({region.category})</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-zinc-400">
                  {region.area.toLocaleString()} km²
                </span>
          <button
                  onClick={() => {
                    // Remove from selected regions
                    const newSelection = selectedRegions.filter(r => r.name !== region.name);
                    setSelectedRegions(newSelection);
                    setTotalArea(calculateTotalArea(newSelection));
                    setIsExceedingLimit(false);

                    // Reset the map style
                    const layer = selectedLayerRef.current;
                    if (layer) {
                      layer.setStyle({
                        color: '#ffffff',
                        weight: 1,
                        fillColor: '#1a1a1a',
                        fillOpacity: 0.3
                      });
                    }
                  }}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-zinc-700">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Total Area:</span>
            <span className="text-white">{totalArea.toLocaleString()} km²</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Estimated Cost:</span>
            <span className="text-white">${calculateCost(selectedRegions).toFixed(2)} USDC</span>
          </div>
          {isExceedingLimit && (
            <div className="mt-2 text-sm text-red-400">
              Selection exceeds area limits. Sovereign regions cannot be combined with others, and non-sovereign regions cannot exceed 6M km².
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-2 text-white/70 hover:text-white transition-colors"
        >
          Back
        </button>
          <button
          onClick={() => {
            if (selectedRegions.length > 0 && !isExceedingLimit) {
              // Pass the actual selected regions data with their areas
              onNext({
                regions: selectedRegions.map(r => r.name),
                totalArea: calculateTotalArea(selectedRegions),
                totalPrice: calculateCost(selectedRegions)
              });
            }
          }}
          disabled={selectedRegions.length === 0 || isExceedingLimit}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Selection
          </button>
      </div>
    </motion.div>
  );
}