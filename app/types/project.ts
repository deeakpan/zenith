export interface ProjectQuestion {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'email' | 'url' | 'select' | 'radio' | 'number' | 'regions' | 'multiselect' | 'image' | 'color';
  required?: boolean;
  placeholder?: string;
  options?: string[];
  icon?: string;
  transform?: 'uppercase';
  minLength?: number;
  maxLength?: number;
  className?: string;
}

export interface SocialPlatform {
  id: string;
  label: string;
  icon: string;
  color: string;
  urlPattern: string;
  placeholder: string;
}

export interface Project {
  id: string;
  type: string;
  name: string;
  about: string;
  blockchain?: string;
  coordinates?: [number, number];
  socialLinks: Record<string, string>;
  createdAt: number;
  updatedAt: number;
  [key: string]: any;
}

export interface Blockchain extends Project {
  regions: string[];
  layerType: string;
  otherLayerType?: string;
  consensus: string;
  tps: number;
  blockTime: number;
  nativeToken: string;
  themeColor: string;
}
