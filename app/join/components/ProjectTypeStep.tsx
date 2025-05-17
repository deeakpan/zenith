'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { StepProps } from '../types';

const projectTypes = [
  { name: 'Blockchain', color: 'bg-blue-500' },
  { name: 'DeFi', color: 'bg-green-500' },
  { name: 'NFT', color: 'bg-purple-500' },
  { name: 'Bridge', color: 'bg-orange-500' },
  { name: 'Infrastructure', color: 'bg-yellow-500' },
  { name: 'Oracle', color: 'bg-indigo-500' },
  { name: 'GameFi', color: 'bg-emerald-500' },
  { name: 'DAO', color: 'bg-violet-500' },
  { name: 'Social', color: 'bg-pink-500' },
  { name: 'AI', color: 'bg-cyan-500' },
  { name: 'Other', color: 'bg-zinc-500' },
];

export default function ProjectTypeStep({ onNext, onBack }: StepProps) {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const filteredTypes = projectTypes.filter((type) =>
    type.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (type: { name: string; color: string }) => {
    setSelectedType(type.name);
    onNext(type.name);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search project types..."
          className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
        {filteredTypes.map((type) => (
          <button
            key={type.name}
            onClick={() => handleSelect(type)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors hover:text-white ${selectedType === type.name ? 'text-white' : 'text-zinc-400'}`}
          >
            <div className={`w-2 h-2 rounded-full ${type.color}`} />
            <span>{type.name}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-start mt-6">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Back</span>
        </button>
      </div>
    </motion.div>
  );
}
