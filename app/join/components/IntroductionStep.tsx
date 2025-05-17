'use client';

import { motion } from 'framer-motion';
import { MapIcon, ChartBarIcon, WalletIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

interface Props {
  onNext: () => void;
}

const features = [
  {
    icon: MapIcon,
    title: 'Claim Your Territory',
    description: 'Blockchains can claim regions on the map to establish their presence',
  },
  {
    icon: ChartBarIcon,
    title: 'Showcase Projects',
    description: 'Register your project within blockchain territories',
  },
  {
    icon: WalletIcon,
    title: 'Connect & Verify',
    description: 'Use your wallet to verify ownership and manage your presence',
  },
  {
    icon: GlobeAltIcon,
    title: 'Global Visibility',
    description: 'Make your project visible to users worldwide',
  },
];

export default function IntroductionStep({ onNext }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex items-start space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <feature.icon className="w-6 h-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-zinc-400">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={onNext}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          Get Started
        </button>
      </div>
    </motion.div>
  );
}
