import { Globe, ShieldCheck } from "lucide-react";

export const VISIBILITY_OPTIONS = [
  {
    value: true,
    label: 'Public',
    description: 'Anyone with the link can view and vote',
    icon: Globe,
  },
  {
    value: false,
    label: 'Private',
    description: 'Only invited people can access',
    icon: ShieldCheck,
  },
] as const