export interface FiltroConfig {
  key?: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'range';
  required?: boolean;
  options?: { label: string, value: any }[];
  keys?: string[];
  subtype?: 'date' | 'number';
}

export interface FiltroConfigValue {
  value: string;
  type: string;
  key?: string;
  keys?: string[];
}
