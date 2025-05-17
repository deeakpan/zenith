'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import IntroductionStep from '@/app/join/components/IntroductionStep';
import ProjectTypeStep from '@/app/join/components/ProjectTypeStep';
import BlockchainSelectionStep from '@/app/join/components/BlockchainSelectionStep';
import ChainSelectionStep from '@/app/join/components/ChainSelectionStep';
import FormStep from '@/app/join/components/FormStep';
import ConfirmationStep from '@/app/join/components/ConfirmationStep';
import type { FormData } from '@/app/join/types';

type Step = 'intro' | 'project' | 'blockchain' | 'chain' | 'form' | 'confirm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState<Step>('intro');
  const [projectType, setProjectType] = useState('');
  const [chain, setChain] = useState('');
  const [formData, setFormData] = useState<FormData>({
    type: '',
    blockchain: '',
    formFields: {},
    regions: []
  });

  const handleNext = (data: any) => {
    switch (step) {
      case 'intro':
        setStep('project');
        break;
      case 'project':
        setProjectType(data);
        setStep(data.toLowerCase() === 'blockchain' ? 'blockchain' : 'chain');
        break;
      case 'blockchain':
        setChain(data);
        setStep('form');
        break;
      case 'chain':
        setChain('Base');
        setStep('form');
        break;
      case 'form':
        setFormData(data);
        setStep('confirm');
        break;
      case 'confirm':
        console.log('Form submitted:', {
          projectType,
          chain,
          formData
        });
        onClose();
        break;
      default:
        console.warn('Unknown step:', step);
        break;
    }
  };

  const handleBack = () => {
    switch (step) {
      case 'project':
        setStep('intro');
        break;
      case 'blockchain':
        setStep('project');
        break;
      case 'chain':
        setStep('project');
        break;
      case 'form':
        setStep(projectType.toLowerCase() === 'blockchain' ? 'blockchain' : 'chain');
        break;
      case 'confirm':
        setStep('form');
        break;
      default:
        console.warn('Unknown step:', step);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex items-start md:items-start justify-center md:mt-12 mt-0"
        >
          <div
            className="absolute inset-0"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="relative w-full md:w-[500px] h-screen md:h-[520px] overflow-hidden md:rounded-2xl bg-[#1a1b1e] shadow-xl md:mx-4 border-0 md:border md:border-primary/20"
          >
            <div className="relative bg-zinc-900/80 backdrop-blur-xl md:rounded-2xl">
              <div className="overflow-y-auto p-5 h-screen md:h-[520px] scrollbar-hide">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 text-zinc-400 hover:text-white"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>

              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-xl pointer-events-none" />
              <div className="flex items-baseline gap-3 mb-3">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-500 via-red-400 to-red-500 bg-clip-text text-transparent tracking-wide">
                  ZENITH
                </h1>
                <span className="text-sm font-medium text-zinc-500 tracking-widest uppercase">map</span>
              </div>
              <p className="text-sm md:text-base text-zinc-300 mb-6 leading-relaxed">
                Your portal to the world of decentralized projects, chains, and regions. Explore, discover, and connect with the global blockchain ecosystem—all visualized on a beautiful interactive map.
              </p>

              <AnimatePresence mode="wait">
                {step === 'intro' && (
                  <IntroductionStep
                    key="intro"
                    onNext={() => handleNext(null)}
                  />
                )}
                {step === 'project' && (
                  <ProjectTypeStep
                    key="project"
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                )}
                {step === 'blockchain' && (
                  <BlockchainSelectionStep
                    key="blockchain"
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                )}
                {step === 'chain' && (
                  <ChainSelectionStep
                    key="chain"
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                )}
                {step === 'form' && (
                  <FormStep
                    key="form"
                    onNext={handleNext}
                    onBack={handleBack}
                    projectType={projectType}
                      formData={formData}
                  />
                )}
                {step === 'confirm' && (
                  <ConfirmationStep
                    key="confirm"
                    onNext={handleNext}
                    onBack={handleBack}
                    data={{
                      projectType,
                      chain,
                        ...formData.formFields
                    }}
                  />
                )}
              </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

