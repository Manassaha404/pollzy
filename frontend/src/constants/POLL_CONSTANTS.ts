import type { Filter, PollStatus, ResultVisibility } from "#/types/polls";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import colors from "./COLORS";

export const STATUS_CONFIG: Record<
  PollStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  active: {
    label: 'Active',
    color: colors.sage,
    bg: `${colors.sage}1A`,
    border: `${colors.sage}4D`,
  },
  draft: {
    label: 'Draft',
    color: colors.steel,
    bg: `${colors.steel}1A`,
    border: `${colors.steel}4D`,
  },
  closed: {
    label: 'Closed',
    color: 'rgba(255,255,255,0.3)',
    bg: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.1)',
  },
}

export const RESULT_VISIBILITY_CONFIG: Record<
  ResultVisibility,
  { label: string; icon: React.ElementType }
> = {
  always: { label: 'Always visible', icon: Eye },
  after_vote: { label: 'After vote', icon: EyeOff },
  creator_only: { label: 'Creator only', icon: ShieldCheck },
}


export const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'closed', label: 'Closed' },
]