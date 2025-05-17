'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StepProps } from '../types';
import { useAccount, useConnect, useSwitchChain, useBalance } from 'wagmi';
import { baseSepolia } from 'viem/chains';
import lighthouse from '@lighthouse-web3/sdk';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { ethers } from 'ethers';
import { ProjectRegistryContract } from '@/app/contracts/ProjectRegistry';

interface ExtendedStepProps extends StepProps {
  data: any;
}

export default function ConfirmationStep({ onBack, onNext, data }: ExtendedStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { switchChain } = useSwitchChain();
  const { data: balance } = useBalance({
    address,
    chainId: baseSepolia.id,
  });
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contract, setContract] = useState<ProjectRegistryContract | null>(null);
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [isLoadingPrice, setIsLoadingPrice] = useState(true);

  useEffect(() => {
    const initContract = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contractAddress = process.env.NEXT_PUBLIC_PROJECT_REGISTRY_ADDRESS;

          if (!contractAddress) {
            throw new Error('Contract address is not configured');
          }

          console.log('Initializing contract with address:', contractAddress);
          const contract = new ProjectRegistryContract(contractAddress, provider);
          setContract(contract);

          // Check if selected regions are available
          if (data?.regions && Array.isArray(data.regions) && data.regions.length > 0) {
            const validRegions = data.regions.filter(
              (name: any): name is string => typeof name === 'string' && name.trim() !== ''
            );

            if (validRegions.length > 0) {
              console.log('Checking region availability for:', validRegions);
              try {
                const areAvailable = await contract.areRegionsAvailable(validRegions);
                if (!areAvailable) {
                  setError('One or more selected regions are already taken');
                }
              } catch (error) {
                console.error('Error checking region availability:', error);
                // Don't block the UI if we can't check availability
              }
            }
          }
        } catch (error) {
          console.error('Contract initialization error:', error);
          setError(error instanceof Error ? error.message : 'Failed to initialize contract');
        }
      } else {
        setError('Please install MetaMask to continue');
      }
    };

    initContract();
  }, [data?.regions]);

  // Add debug logging for button state
  useEffect(() => {
    const regions = Array.isArray(data?.regions) ? data.regions : [data?.regions].filter(Boolean);
    const buttonState = {
      isLoading,
      hasContract: !!contract,
      hasRegions: regions.length > 0,
      hasTotalPrice:
        typeof data?.formFields?.totalPrice === 'number' && data.formFields.totalPrice > 0,
      hasError: !!error,
      regions: regions,
      totalPrice: data?.formFields?.totalPrice,
      error: error,
    };
    console.log('Button state:', JSON.stringify(buttonState, null, 2));
  }, [isLoading, contract, data?.regions, data?.formFields?.totalPrice, error]);

  // Calculate total price when regions change
  useEffect(() => {
    if (data?.regions) {
      // Handle both array and comma-separated string cases
      const regions = Array.isArray(data.regions)
        ? data.regions
        : typeof data.regions === 'string'
          ? data.regions.split(',').map((r: string) => r.trim())
          : [data.regions].filter(Boolean);

      console.log('Using price and area from map selection:', {
        totalPrice: data.formFields?.totalPrice,
        totalArea: data.formFields?.totalArea,
      });
    }
  }, [data?.regions]);

  // Fetch current ETH price with retries
  useEffect(() => {
    const fetchEthPrice = async (retries = 3) => {
      try {
        setIsLoadingPrice(true);
        // Add a small delay before each attempt
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('CoinGecko response:', data);

        if (!data?.ethereum?.usd) {
          throw new Error('Invalid price data received');
        }

        console.log('Fetched ETH price:', data.ethereum.usd);
        setEthPrice(data.ethereum.usd);
      } catch (error) {
        console.error('Error fetching ETH price:', error);
        if (retries > 0) {
          console.log(`Retrying price fetch... ${retries} attempts remaining`);
          setTimeout(() => fetchEthPrice(retries - 1), 2000);
        } else {
          setError('Failed to fetch current ETH price. Please try again later.');
        }
      } finally {
        setIsLoadingPrice(false);
      }
    };

    fetchEthPrice();
  }, [data.formFields?.totalPrice, data.formFields?.totalArea]);

  const handleConnect = async (connector: any) => {
    try {
      // Connect first
      await connect({ connector });

      // Then force switch to Base Sepolia
      try {
        await switchChain({
          chainId: baseSepolia.id,
        });
      } catch (error) {
        console.error('Failed to switch chain:', error);
      }

      setIsWalletDropdownOpen(false);
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const uploadToLighthouse = async (data: any) => {
    try {
      console.log('Starting Lighthouse upload with data:', data);

      const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY;
      if (!apiKey) {
        throw new Error('Lighthouse API key is not configured');
      }

      // Handle image upload if it exists
      let imageCID = null;
      if (data.logo instanceof File) {
        console.log('Uploading image to Lighthouse...');
        // Convert File to Buffer
        const arrayBuffer = await data.logo.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const imageResponse = await lighthouse.uploadBuffer(buffer, apiKey);
        console.log('Image upload response:', imageResponse);

        if (!imageResponse.data || !imageResponse.data.Hash) {
          throw new Error('Invalid response from Lighthouse for image upload');
        }

        imageCID = imageResponse.data.Hash;
      }

      // Prepare data for JSON upload
      const uploadData = {
        ...data,
        logo: imageCID || data.logo,
        timestamp: new Date().toISOString(),
      };

      // Create filename based on project type and name
      const fileName = `${data.projectType}-${data.name?.toLowerCase().replace(/\s+/g, '-') || 'project'}`;

      // Convert data to JSON string
      const jsonData = JSON.stringify(uploadData, null, 2);
      console.log('JSON data to upload:', jsonData);

      // Upload JSON to Lighthouse
      console.log(`Starting upload for ${fileName}...`);
      const response = await lighthouse.uploadText(jsonData, apiKey, fileName);
      console.log('Lighthouse upload response:', response);

      if (!response.data || !response.data.Hash) {
        throw new Error('Invalid response from Lighthouse for JSON upload');
      }

      console.log(`Successfully uploaded ${fileName} to Lighthouse`);
      console.log(`IPFS Hash: ${response.data.Hash}`);

      return {
        ...response.data,
        imageCID,
      };
    } catch (err) {
      console.error('Detailed Lighthouse upload error:', {
        error: err,
        message: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
      });
      throw new Error(
        `Failed to upload project data: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    }
  };

  const calculatePrice = (regions: string[]) => {
    // All regions cost $0.4 per 1 million square km
    const regionAreas: { [key: string]: number } = {
      // Europe
      Finland: 338424,
      Sweden: 450295,
      Norway: 385207,
      Denmark: 43094,
      Iceland: 103000,
      Estonia: 45227,
      Latvia: 64589,
      Lithuania: 65300,
      Poland: 312696,
      Germany: 357022,
      Netherlands: 41543,
      Belgium: 30528,
      Luxembourg: 2586,
      France: 551695,
      Spain: 505990,
      Portugal: 92212,
      Italy: 301340,
      Switzerland: 41285,
      Austria: 83879,
      'Czech Republic': 78867,
      Slovakia: 49035,
      Hungary: 93030,
      Slovenia: 20273,
      Croatia: 56594,
      Romania: 238397,
      Bulgaria: 110879,
      Greece: 131957,
      Albania: 28748,
      'North Macedonia': 25713,
      // North America
      Canada: 9984670,
      'United States': 9833517,
      Mexico: 1964375,
      // South America
      Brazil: 8515770,
      Argentina: 2780400,
      Colombia: 1141748,
      Peru: 1285216,
      Venezuela: 916445,
      Chile: 756102,
      Ecuador: 283561,
      Bolivia: 1098581,
      Paraguay: 406752,
      Uruguay: 181034,
      Guyana: 214969,
      Suriname: 163820,
      'French Guiana': 83534,
      // Asia
      China: 9596961,
      India: 3287263,
      Japan: 377975,
      'South Korea': 100210,
      'North Korea': 120538,
      Vietnam: 331212,
      Thailand: 513120,
      Myanmar: 676578,
      Malaysia: 330803,
      Indonesia: 1904569,
      Philippines: 300000,
      Cambodia: 181035,
      Laos: 236800,
      Singapore: 719,
      Brunei: 5765,
      'East Timor': 14874,
      // Africa
      'South Africa': 1221037,
      Egypt: 1002450,
      Nigeria: 923768,
      Algeria: 2381741,
      Sudan: 1886068,
      Libya: 1759540,
      Morocco: 446550,
      Ethiopia: 1104300,
      Somalia: 637657,
      Kenya: 580367,
      Tanzania: 947303,
      Uganda: 241550,
      Ghana: 238533,
      Mali: 1240192,
      Niger: 1267000,
      Chad: 1284000,
      Angola: 1246700,
      Mozambique: 801590,
      Zambia: 752618,
      Zimbabwe: 390757,
      Madagascar: 587041,
      Botswana: 581730,
      Namibia: 825615,
      Senegal: 196722,
      Guinea: 245857,
      "Côte d'Ivoire": 322463,
      Cameroon: 475442,
      'Democratic Republic of the Congo': 2344858,
      'Republic of the Congo': 342000,
      'Central African Republic': 622984,
      'South Sudan': 644329,
      Burundi: 27834,
      Rwanda: 26338,
      Eritrea: 117600,
      Djibouti: 23200,
      Comoros: 2235,
      Mauritius: 2040,
      Seychelles: 455,
      'São Tomé and Príncipe': 964,
      Gabon: 267668,
      // Oceania
      Australia: 7692024,
      'New Zealand': 268021,
      'Papua New Guinea': 462840,
      Fiji: 18274,
      'Solomon Islands': 28896,
      Vanuatu: 12189,
      Samoa: 2842,
      Kiribati: 811,
      Micronesia: 702,
      'Marshall Islands': 181,
      Palau: 459,
      Nauru: 21,
      Tuvalu: 26,
    };

    const totalArea = regions.reduce((sum, region) => {
      const area = regionAreas[region] || 0;
      console.log(`Area for ${region}: ${area} km²`);
      return sum + area;
    }, 0);

    const totalPrice = (totalArea / 1000000) * 0.4;
    console.log(`Total area: ${totalArea} km², Total price: $${totalPrice}`);

    return totalPrice;
  };

  const handleSubmit = async () => {
    if (!contract || !address) {
      setError('Please connect your wallet first');
      return;
    }

    if (!ethPrice) {
      setError('Unable to fetch current ETH price. Please try again later.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 1. Calculate price in ETH using the price from map selection
      const priceInUsd = data.formFields?.totalPrice;
      if (!priceInUsd || priceInUsd <= 0) {
        throw new Error('Invalid price calculation');
      }

      const priceInEth = priceInUsd / ethPrice;
      if (!isFinite(priceInEth) || priceInEth <= 0) {
        throw new Error('Invalid ETH price conversion');
      }

      console.log('Price details:', {
        usd: priceInUsd,
        ethPrice: ethPrice,
        eth: priceInEth,
        totalArea: data.formFields?.totalArea,
      });

      // Convert to Wei using BigInt
      const weiAmount = BigInt(Math.floor(priceInEth * 1e18));
      const priceInWei = weiAmount;

      console.log('Conversion details:', {
        ethAmount: priceInEth,
        weiAmount: weiAmount.toString(),
        priceInWei: priceInWei.toString(),
      });

      // 2. Register project with contract
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      try {
        // Split regions if they're comma-separated
        const regions = Array.isArray(data.regions)
          ? data.regions
          : typeof data.regions === 'string'
            ? data.regions.split(',').map((r: string) => r.trim())
            : [data.regions].filter(Boolean);

        console.log('Registering project with regions:', regions);

        const tx = await contract.registerProject(
          data.name,
          data.projectType,
          '', // Empty imageCID for now
          '', // Empty dataCID for now
          regions,
          priceInWei,
          signer
        );

        // 3. Wait for transaction to be mined
        const receipt = await tx.wait();
        console.log('Transaction receipt:', receipt);

        // 4. Only after successful transaction, upload to Lighthouse
        const { imageCID, dataCID } = await uploadToLighthouse(data);

        // 5. Update UI or show success message
        console.log('Project registered successfully!');
        setShowSuccess(true);
      } catch (txError: any) {
        console.error('Transaction error:', txError);
        setError(txError.message || 'Failed to register project');
      }
    } catch (error: any) {
      console.error('Error registering project:', error);
      setError(error.message || 'Failed to register project');
    } finally {
      setIsLoading(false);
    }
  };

  const formatValue = (key: string, value: any) => {
    if (key === 'logo' && value instanceof File) {
      return value.name;
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return value?.toString() || '';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-lg p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                className="mx-auto w-16 h-16 text-green-500 mb-4"
              >
                <CheckCircleIcon className="w-full h-full" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-2">Welcome to Zenith!</h3>
              <p className="text-white/70">
                Your project is now part of the decentralized mapping revolution.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {/* Project Type and Chain */}
        <div className="p-4 rounded-lg bg-white/5">
          <h3 className="font-medium mb-4">Project Overview</h3>
          <dl className="space-y-3">
            <div className="grid grid-cols-3">
              <dt className="text-zinc-400">Project Type</dt>
              <dd className="col-span-2 font-medium">{data?.projectType}</dd>
            </div>
            <div className="grid grid-cols-3">
              <dt className="text-zinc-400">Chain</dt>
              <dd className="col-span-2 font-medium">{data?.chain}</dd>
            </div>
            {data?.chainType && (
              <div className="grid grid-cols-3">
                <dt className="text-zinc-400">Chain Type</dt>
                <dd className="col-span-2 font-medium">{data.chainType}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Project Details */}
        <div className="p-4 rounded-lg bg-white/5">
          <h3 className="font-medium mb-4">Project Details</h3>
          <dl className="space-y-3">
            {Object.entries(data || {}).map(([key, value]) => {
              // Skip already displayed fields and empty values
              if (['projectType', 'chain', 'chainType', 'regions'].includes(key) || !value) {
                return null;
              }
              return (
                <div key={key} className="grid grid-cols-3">
                  <dt className="text-zinc-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </dt>
                  <dd className="col-span-2">{formatValue(key, value)}</dd>
                </div>
              );
            })}
          </dl>
        </div>

        {/* Regions (if applicable) */}
        {data?.regions && (
          <div className="p-4 rounded-lg bg-white/5">
            <h3 className="font-medium mb-4">Selected Regions</h3>
            <div className="space-y-2">
              {Array.isArray(data.regions) ? (
                data.regions.map((region: string) => (
                  <div key={region} className="text-sm">
                    {region}
                  </div>
                ))
              ) : (
                <div className="text-sm">{data.regions}</div>
              )}
            </div>
            {data.formFields?.totalArea && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Total Area:</span>
                  <span className="text-white">
                    {data.formFields.totalArea.toLocaleString()} km²
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-zinc-400">Estimated Cost:</span>
                  <span className="text-white">${data.formFields.totalPrice?.toFixed(2)} USDC</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* About */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-zinc-400">About</h3>
          <div className="max-h-32 overflow-y-auto custom-scrollbar">
            <p className="text-sm text-zinc-200 whitespace-pre-wrap">{data?.about}</p>
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-between">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="px-6 py-2 text-white/70 hover:text-white transition-colors disabled:opacity-50"
        >
          Back
        </button>
        {isConnected ? (
          <button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              !contract ||
              !data?.regions ||
              typeof data?.formFields?.totalPrice !== 'number' ||
              data.formFields.totalPrice <= 0 ||
              !!error
            }
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Claiming Regions...' : 'Claim Selected Regions'}
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={() => setIsWalletDropdownOpen(!isWalletDropdownOpen)}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Connect Wallet
            </button>
            <AnimatePresence>
              {isWalletDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-white/10 bg-black/80 backdrop-blur-md shadow-lg"
                >
                  <div className="py-1">
                    {connectors.map((connector) => (
                      <button
                        key={connector.id}
                        onClick={() => handleConnect(connector)}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10"
                      >
                        Connect with {connector.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
