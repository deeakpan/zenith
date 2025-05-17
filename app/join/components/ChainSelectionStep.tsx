'use client';

import { motion } from 'framer-motion';
import { CubeIcon } from '@heroicons/react/24/outline';
import type { StepProps } from '../types';

export default function ChainSelectionStep({ onNext, onBack }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="p-6 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium">Base</h3>
            <p className="text-sm text-zinc-400 mt-1">
              The secure and scalable Ethereum L2 solution
            </p>
          </div>
          <CubeIcon className="w-8 h-8 text-primary" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Network</span>
            <span>Mainnet</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Status</span>
            <span className="text-green-400">Active</span>
          </div>
        </div>

        <button
          onClick={() => onNext('Base')}
          className="w-full mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Select Base
        </button>
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
