import { Globe, ShieldCheck } from "lucide-react";

export const VISIBILITY_OPTIONS = [
  {
    value: true,
    label: 'Public',
    description: 'Anyone can view and vote and authrization not required',
    icon: Globe,
  },
  {
    value: false,
    label: 'Private',
    description: 'Only invited people can access and authrization required',
    icon: ShieldCheck,
  },
] as const