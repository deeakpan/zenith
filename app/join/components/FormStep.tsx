'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapIcon } from '@heroicons/react/24/outline';
import type { FormStepProps, FormData } from '../types';
import { PROJECT_QUESTIONS } from '@/app/constants/projectQuestions';
import { ProjectQuestion } from '@/app/types/project';
import { validateField, validateForm } from '@/app/utils/validation';
import { z } from 'zod';
import RegionSelectionStep from './RegionSelectionStep';

export default function FormStep({
  onNext,
  onBack,
  projectType,
  formData: initialFormData,
}: FormStepProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialFormData.formFields || {});
  const [questions, setQuestions] = useState<ProjectQuestion[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRegionSelection, setShowRegionSelection] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [totalArea, setTotalArea] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleRegionSelection = (data: {
    regions: string[];
    totalArea: number;
    totalPrice: number;
  }) => {
    setSelectedRegions(data.regions);
    setTotalArea(data.totalArea);
    setTotalPrice(data.totalPrice);
    setFormData((prev) => ({
      ...prev,
      regions: data.regions.join(','),
      totalArea: data.totalArea,
      totalPrice: data.totalPrice,
    }));
    // Clear any existing region errors when selection is successful
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.regions;
      return newErrors;
    });
    setShowRegionSelection(false);
  };

  useEffect(() => {
    const projectKey = projectType.toLowerCase().replace('infrastructure', 'infra');
    setQuestions(PROJECT_QUESTIONS[projectKey] || []);
  }, [projectType]);

  const validateFieldValue = async (id: string, value: any) => {
    const question = questions.find((q) => q.id === id);
    if (!question) return;

    if (question.type === 'regions') {
      if (!value || !value.length) {
        return 'Please select at least one region';
      }
      return true;
    }

    let schema;
    switch (question.type) {
      case 'email':
        schema = z.string().email('Please enter a valid email address');
        break;
      case 'url':
        schema = z.string().url('Please enter a valid URL');
        break;
      case 'number':
        if (id === 'tps' || id === 'blockTime') {
          schema = z
            .string()
            .regex(/^\d+$/, 'Please enter a valid number')
            .transform((val) => parseInt(val, 10))
            .refine((val) => val > 0, 'Value must be greater than 0');
        } else {
          schema = z.number().min(0, 'Value must be greater than 0');
        }
        break;
      case 'image':
        schema = z
          .instanceof(File, { message: 'Please upload a logo' })
          .refine((file) => file.size <= 2 * 1024 * 1024, 'Logo must be less than 2MB')
          .refine(
            (file) =>
              ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'].includes(
                file.type
              ),
            'Logo must be a valid image file (JPG, PNG, GIF, WEBP, or SVG)'
          );
        break;
      case 'nativeToken':
        schema = z
          .string()
          .regex(
            /^[A-Z0-9$]{1,7}$/,
            'Token symbol must be 1-7 characters (letters, numbers, $ only)'
          )
          .transform((val) => val.toUpperCase());
        break;
      case 'color':
        schema = z
          .string()
          .regex(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/, 'Please enter a valid hex color code');
        break;
      default:
        if (question.required) {
          schema = z.string().min(1, 'This field is required');
        } else {
          schema = z.string().optional();
        }
    }

    const result = await validateField(value, schema, question.label);
    setErrors((prev) => ({
      ...prev,
      [id]: result.error || '',
    }));
    return result.isValid;
  };

  const handleFieldChange = async (
    id: string,
    value: any,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const question = questions.find((q) => q.id === id);
    let processedValue = value;

    if (question?.type === 'image') {
      processedValue = value as File;
    } else if (id === 'nativeToken') {
      // Only allow letters, numbers, and $ symbol, max 7 characters
      processedValue = (value as string)
        .replace(/[^A-Za-z0-9$]/g, '')
        .toUpperCase()
        .slice(0, 7);
    } else if (id === 'tps' || id === 'blockTime') {
      // Only allow numbers, no scientific notation
      processedValue = (value as string).replace(/[^0-9]/g, '').slice(0, 10); // Limit to 10 digits
    }

    setFormData((prev) => ({
      ...prev,
      [id]: processedValue,
    }));

    await validateFieldValue(id, processedValue);
  };

  const calculatePrice = (regions: string[]) => {
    // All regions cost $0.4 per 1 million square km
    const regionAreas: { [key: string]: number } = {
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
    };

    const totalArea = regions.reduce((sum, region) => sum + (regionAreas[region] || 0), 0);
    return (totalArea / 1000000) * 0.4;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate all required fields first
      const requiredFields = questions.filter((q) => q.required);
      const validationErrors: Record<string, string> = {};

      for (const field of requiredFields) {
        const value = formData[field.id];
        if (!value) {
          validationErrors[field.id] = `${field.label} is required`;
        } else {
          const isValid = await validateFieldValue(field.id, value);
          if (!isValid) {
            validationErrors[field.id] = `Invalid ${field.label}`;
          }
        }
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setIsSubmitting(false);
        return;
      }

      // Validate regions for blockchain projects
      if (projectType.toLowerCase() === 'blockchain') {
        if (!selectedRegions.length) {
          setErrors((prev) => ({
            ...prev,
            regions: 'Please select at least one region',
          }));
          setIsSubmitting(false);
          return;
        }

        // Use the price from formData that was set by RegionSelectionStep
        const formDataToSubmit: FormData = {
          type: projectType,
          blockchain: projectType.toLowerCase() === 'blockchain' ? 'blockchain' : 'base',
          formFields: {
            ...formData,
            totalPrice: formData.totalPrice,
          },
          regions: selectedRegions,
        };
        onNext(formDataToSubmit);
      } else {
        // For non-blockchain projects
        const formDataToSubmit: FormData = {
          type: projectType,
          blockchain: 'base',
          formFields: formData,
          regions: [],
        };
        onNext(formDataToSubmit);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ _form: 'An error occurred while submitting the form' });
    }
    setIsSubmitting(false);
  };

  const renderField = (question: ProjectQuestion) => {
    const value = formData[question.id];
    const commonProps = {
      id: question.id,
      value: value || '',
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      ) => {
        handleFieldChange(question.id, e.target.value, e);
      },
      className: `mt-1 block w-full rounded-md bg-[#1a1b1e] border ${
        errors[question.id] ? 'border-red-500' : 'border-white/10'
      } px-3 py-2 text-zinc-200 focus:border-primary focus:ring-0`,
      required: question.required,
      placeholder: question.placeholder,
    };

    switch (question.type) {
      case 'regions':
        if (projectType.toLowerCase() !== 'blockchain') {
          return null;
        }
        return (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setShowRegionSelection(true)}
              className="flex items-center gap-2 w-full px-4 py-2 rounded-lg bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500 border-zinc-700 hover:bg-zinc-700"
            >
              <MapIcon className="w-5 h-5" />
              <span>
                {Array.isArray(selectedRegions) && selectedRegions.length > 0
                  ? selectedRegions.join(', ')
                  : question.placeholder}
              </span>
            </button>
            {selectedRegions.length > 0 && (
              <div className="bg-zinc-800/50 p-3 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Total Area:</span>
                  <span className="text-white">{totalArea.toLocaleString()} km²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Estimated Cost:</span>
                  <span className="text-white">${totalPrice.toFixed(2)} USDC</span>
                </div>
              </div>
            )}
          </div>
        );
      case 'textarea':
        return (
          <div className="space-y-1">
            <textarea {...commonProps} rows={4} />
            {question.id === 'about' && (
              <div className="text-xs text-zinc-400 text-right">
                {(value as string)?.length || 0}/550 characters
              </div>
            )}
          </div>
        );
      case 'select':
        return (
          <select
            {...commonProps}
            className="mt-1 block w-full rounded-md bg-[#1a1b1e] border border-white/10 px-3 py-2 text-zinc-200 focus:border-primary focus:ring-0"
            style={{
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.5rem center',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '2.5rem',
            }}
          >
            <option value="" className="bg-[#1a1b1e] text-zinc-200">
              Select an option
            </option>
            {question.options?.map((option) => (
              <option key={option} value={option} className="bg-[#1a1b1e] text-zinc-200">
                {option}
              </option>
            ))}
          </select>
        );
      case 'image':
        return (
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFormData((prev) => ({ ...prev, [question.id]: file }));
                  validateFieldValue(question.id, file);
                }
              }}
              className={`mt-1 block w-full rounded-md bg-[#1a1b1e] border border-white/10 px-3 py-2 text-zinc-200 focus:border-primary focus:ring-0
                file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium
                file:bg-primary file:text-zinc-200 hover:file:bg-primary/90 cursor-pointer`}
            />
            <p className="text-xs text-zinc-400">
              Accepted formats: JPG, PNG, GIF, WEBP, SVG (max 2MB)
            </p>
          </div>
        );
      case 'color':
        return (
          <div className="flex items-center gap-3">
            <input
              {...commonProps}
              type="color"
              className="h-10 w-20 p-1 rounded-lg bg-transparent border border-white/10 cursor-pointer"
            />
            <span className="text-zinc-400 font-mono">{value || '#000000'}</span>
          </div>
        );
      default:
        return <input {...commonProps} type={question.type} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-4"
    >
      {showRegionSelection ? (
        <RegionSelectionStep
          onNext={handleRegionSelection}
          onBack={() => setShowRegionSelection(false)}
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
          {questions.map((question) => {
            const field = renderField(question);
            return (
              <div key={question.id} className="space-y-1">
                <label htmlFor={question.id} className="block text-sm font-medium text-white">
                  {question.label}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field}
                {errors[question.id] && (
                  <p className="text-sm text-red-500 mt-1">{errors[question.id]}</p>
                )}
              </div>
            );
          })}

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 text-white/70 hover:text-white transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Validating...' : 'Next'}
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
}
