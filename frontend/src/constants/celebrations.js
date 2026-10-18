export const CELEBRATION_OCCASIONS = [
  { value: 'birthday', label: 'Birthday', subtitle: 'Turn a birthday into meals for someone' },
  { value: 'anniversary', label: 'Anniversary', subtitle: 'Celebrate years together by giving' },
  { value: 'graduation', label: 'Graduation', subtitle: 'Mark your big milestone with kindness' },
  { value: 'newjob', label: 'New Job', subtitle: 'Kick off the new role with a gift that lasts' },
  { value: 'achievement', label: 'Achievement', subtitle: 'A win is sweeter when it helps others' },
  { value: 'wedding', label: 'Wedding', subtitle: 'Start married life by sharing joy' },
  { value: 'newhome', label: 'New Home', subtitle: 'Housewarming? Bless a community instead' },
  { value: 'festival', label: 'Festival', subtitle: 'Give the gift of hope this festive season' },
  { value: 'inmemory', label: 'In Memory', subtitle: 'Honour someone special with a lasting tribute' },
  { value: 'milestone', label: 'Personal Milestone', subtitle: 'Any moment worth celebrating' },
  { value: 'justbecause', label: 'Just Because', subtitle: 'No reason needed to spread kindness' },
  { value: 'family', label: 'Family & Friends', subtitle: 'Get the people you love to chip in' },
];

export const CELEBRATION_CAUSES = [
  { value: 'food', label: 'Food', description: 'Meals & ration kits', image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1200&auto=format&fit=crop', accent: 'amber' },
  { value: 'clothes', label: 'Clothes', description: 'Winter wear & clothing', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200&auto=format&fit=crop', accent: 'teal' },
  { value: 'medicine', label: 'Medicine', description: 'Essential medicines', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1200&auto=format&fit=crop', accent: 'coral' },
  { value: 'blood', label: 'Blood', description: 'Blood bank support', image: 'https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?q=80&w=1200&auto=format&fit=crop', accent: 'rose' },
];

export const CELEBRATION_AMOUNTS = [100, 250, 500, 1000];

export const CELEBRATION_AMOUNT_MIN = 10;
export const CELEBRATION_AMOUNT_MAX = 1000000;

export const CELEBRATION_THEMES = [
  { value: 'celebrate', label: 'Celebrate', gradient: 'from-teal-500 to-emerald-600' },
  { value: 'sky', label: 'Sky', gradient: 'from-sky-500 to-cyan-600' },
  { value: 'coral', label: 'Warm Coral', gradient: 'from-coral-500 to-rose-600' },
  { value: 'sunset', label: 'Sunset', gradient: 'from-amber-500 to-orange-600' },
  { value: 'royal', label: 'Royal', gradient: 'from-indigo-500 to-violet-600' },
];

export const CELEBRATION_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  CLOSED: 'closed',
};

export const CELEBRATION_STATUS_LABELS = {
  [CELEBRATION_STATUS.ACTIVE]: 'Active',
  [CELEBRATION_STATUS.PAUSED]: 'Paused',
  [CELEBRATION_STATUS.COMPLETED]: 'Completed',
  [CELEBRATION_STATUS.CLOSED]: 'Closed',
};

export function celebrationOccasionLabel(value) {
  return CELEBRATION_OCCASIONS.find((o) => o.value === value)?.label || value;
}

export function celebrationCauseById(value) {
  return CELEBRATION_CAUSES.find((c) => c.value === value);
}