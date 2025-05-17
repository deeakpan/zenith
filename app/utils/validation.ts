import { z } from 'zod';

// Common validation schemas
export const urlSchema = z.string().url('Please enter a valid URL');
export const emailSchema = z.string().email('Please enter a valid email address');
export const numberSchema = z.number().min(0, 'Value must be greater than 0');

// Project validation schemas
export const projectBaseSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  logo: z.instanceof(File, { message: 'Please upload a logo' })
    .refine(file => file.size <= 2 * 1024 * 1024, 'Logo must be less than 2MB')
    .refine(
      file => ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'].includes(file.type),
      'Logo must be a valid image file (JPG, PNG, GIF, WEBP, or SVG)'
    ),
  about: z.string()
    .min(50, 'Description must be at least 50 characters')
    .max(500, 'Description must be less than 500 characters'),
  website: urlSchema.optional(),
  regions: z.array(z.string()).optional(),
});

// Blockchain specific schema
export const blockchainSchema = projectBaseSchema.extend({
  layerType: z.enum(['Layer 1', 'Layer 2', 'Sidechain', 'Application Chain', 'Other']),
  otherLayerType: z.string().optional(),
  consensus: z.enum(['Proof of Stake', 'Proof of Work', 'Proof of Authority', 'Other']),
  tps: numberSchema,
  blockTime: numberSchema,
  nativeToken: z.string()
    .min(1, 'Please enter a token symbol')
    .max(10, 'Token symbol must be less than 10 characters'),
  themeColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Please enter a valid hex color'),
});

// DeFi specific schema
export const defiSchema = projectBaseSchema.extend({
  type: z.enum(['DEX', 'Lending', 'Yield Farming', 'Insurance', 'Other']),
  tvl: numberSchema.optional(),
});

// NFT specific schema
export const nftSchema = projectBaseSchema.extend({
  type: z.enum(['Art', 'Gaming', 'Music', 'Virtual Real Estate', 'Other']),
});

// Bridge specific schema
export const bridgeSchema = projectBaseSchema.extend({
  category: z.enum(['Token', 'NFT', 'Message', 'Other']),
  otherCategory: z.string().optional(),
  networks: z.array(z.string()).min(1, 'Please select at least one network'),
});

// Oracle specific schema
export const oracleSchema = projectBaseSchema.extend({
  type: z.enum(['Price Feed', 'Random Number', 'Weather', 'Sports', 'Other']),
  otherType: z.string().optional(),
  updateFrequency: z.enum(['Real-time', 'Every minute', 'Every hour', 'Daily', 'Other']),
  supportedNetworks: z.union([
    z.string().transform(val => [val]),
    z.array(z.string())
  ]).refine(val => val.length > 0, 'Please select at least one network'),
});

// Validation helper functions
export const validateField = async (
  value: any,
  schema: z.ZodTypeAny,
  fieldName: string
): Promise<{ isValid: boolean; error?: string }> => {
  try {
    await schema.parseAsync(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.errors[0].message
      };
    }
    return {
      isValid: false,
      error: `Invalid ${fieldName}`
    };
  }
};

export const validateForm = async (
  formData: Record<string, any>,
  projectType: string
): Promise<{ isValid: boolean; errors: Record<string, string> }> => {
  const schema = {
    blockchain: blockchainSchema,
    defi: defiSchema,
    nft: nftSchema,
    bridge: bridgeSchema,
    oracle: oracleSchema,
  }[projectType.toLowerCase()];

  if (!schema) {
    return {
      isValid: false,
      errors: { _form: 'Invalid project type' }
    };
  }

  try {
    await schema.parseAsync(formData);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach(err => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { isValid: false, errors };
    }
    return {
      isValid: false,
      errors: { _form: 'Validation failed' }
    };
  }
}; 