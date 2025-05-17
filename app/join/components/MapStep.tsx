import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ProjectRegistryContract } from '@/app/contracts/ProjectRegistry';
import { ethers } from 'ethers';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';

// ... existing imports ...

export default function MapStep({ data, onUpdate }: StepProps) {
  const { address } = useAccount();
  const [selectedRegions, setSelectedRegions] = useState<string[]>(data.regions || []);
  const [takenRegions, setTakenRegions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contract, setContract] = useState<ProjectRegistryContract | null>(null);

  useEffect(() => {
    const initContract = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contractAddress = process.env.NEXT_PUBLIC_PROJECT_REGISTRY_ADDRESS;
        if (contractAddress) {
          const contract = new ProjectRegistryContract(contractAddress, provider);
          setContract(contract);
          
          // Get taken regions
          const { takenRegions } = await contract.getAllRegionsStatus();
          setTakenRegions(takenRegions);
        }
      }
    };

    initContract();
  }, []);

  useEffect(() => {
    const checkRegionAvailability = async () => {
      if (contract) {
        try {
          const { takenRegions } = await contract.getAllRegionsStatus();
          setTakenRegions(takenRegions);
        } catch (error) {
          console.error('Error checking region availability:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkRegionAvailability();
  }, [contract]);

  const handleRegionClick = (regionName: string) => {
    if (takenRegions.includes(regionName)) {
      return; // Don't allow selection of taken regions
    }

    setSelectedRegions(prev => {
      const newRegions = prev.includes(regionName)
        ? prev.filter(r => r !== regionName)
        : [...prev, regionName];
      
      onUpdate({ regions: newRegions });
      return newRegions;
    });
  };

  const getRegionStyle = (regionName: string) => {
    if (takenRegions.includes(regionName)) {
      return {
        fillColor: '#ff0000',
        fillOpacity: 0.7,
        color: '#000',
        weight: 1
      };
    }
    
    if (selectedRegions.includes(regionName)) {
      return {
        fillColor: '#4CAF50',
        fillOpacity: 0.7,
        color: '#000',
        weight: 1
      };
    }

    return {
      fillColor: '#3388ff',
      fillOpacity: 0.2,
      color: '#000',
      weight: 1
    };
  };

  return (
    <div className="space-y-6">
      <div className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <MapContainer
            center={[60, 15]}
            zoom={4}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <GeoJSON
              data={geoData}
              style={(feature) => getRegionStyle(feature.properties.name)}
              onEachFeature={(feature, layer) => {
                layer.on({
                  click: () => handleRegionClick(feature.properties.name)
                });
              }}
            />
          </MapContainer>
        )}
      </div>
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Legend:</h3>
        <div className="flex gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#3388ff] opacity-20 mr-2"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#4CAF50] opacity-70 mr-2"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#ff0000] opacity-70 mr-2"></div>
            <span>Taken</span>
          </div>
        </div>
      </div>
    </div>
  );
} 