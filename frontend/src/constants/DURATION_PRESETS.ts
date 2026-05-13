import { format, addMinutes, addHours, addDays, addWeeks } from 'date-fns'
export const DURATION_PRESETS = [
  { label: '10 min',  fn: () => addMinutes(new Date(), 10)  },
  { label: '30 min',  fn: () => addMinutes(new Date(), 30)  },
  { label: '1 hr',    fn: () => addHours(new Date(), 1)     },
  { label: '2 hr',    fn: () => addHours(new Date(), 2)     },
  { label: '6 hr',    fn: () => addHours(new Date(), 6)     },
  { label: '12 hr',   fn: () => addHours(new Date(), 12)    },
  { label: '1 day',   fn: () => addDays(new Date(), 1)      },
  { label: '3 days',  fn: () => addDays(new Date(), 3)      },
  { label: '1 week',  fn: () => addWeeks(new Date(), 1)     },
  { label: 'No limit',fn: () => null                        },
] as const