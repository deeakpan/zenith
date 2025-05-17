'use client';

import { motion } from 'framer-motion';
import { CubeTransparentIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import type { StepProps } from '../types';

const options = [
  {
    id: 'evm',
    title: 'EVM Compatible',
    description: 'For blockchains that are compatible with the Ethereum Virtual Machine',
    icon: CubeTransparentIcon,
  },
  {
    id: 'non-evm',
    title: 'Non-EVM',
    description: 'For blockchains with their own virtual machine implementation',
    icon: Squares2X2Icon,
  }
];

export default function BlockchainSelectionStep({ onNext, onBack }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onNext(option.id)}
            className="p-6 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left group"
          >
            <option.icon className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-medium group-hover:text-primary transition-colors">
              {option.title}
            </h3>
            <p className="text-sm text-zinc-400 mt-2">
              {option.description}
            </p>
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 text-white/70 hover:text-white transition-colors"
        >
          Back
        </button>
      </div>
    </motion.div>
  );
}
