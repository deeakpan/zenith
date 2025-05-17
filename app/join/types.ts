export type Step = 'intro' | 'projectType' | 'blockchain' | 'form' | 'region' | 'confirm';

export interface StepProps {
  onNext: (data?: any) => void;
  onBack: () => void;
}

export interface FormData {
  type: string;
  blockchain: string;
  formFields: Record<string, any>;
  regions: string[];
}

export interface ProjectQuestion {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  transform?: 'uppercase';
}

export interface FormStepProps extends StepProps {
  projectType: string;
  formData: FormData;
}
