import { URGENCY_WEIGHT } from '../constants/categories';

// Demo priority-score algorithm: weighs urgency, number of affected
// people, and how soon the need is required. Score is 0-100.
export function calculatePriorityScore({ urgency, affectedPeople = 1, neededBefore }) {
  const urgencyWeight = URGENCY_WEIGHT[urgency] || 1;
  const urgencyScore = (urgencyWeight / 4) * 55;

  const peopleScore = Math.min(affectedPeople / 10, 1) * 25;

  let timeScore = 10;
  if (neededBefore) {
    const hoursLeft = (new Date(neededBefore).getTime() - Date.now()) / 3600000;
    if (hoursLeft <= 6) timeScore = 20;
    else if (hoursLeft <= 24) timeScore = 16;
    else if (hoursLeft <= 72) timeScore = 10;
    else timeScore = 5;
  }

  const total = Math.round(urgencyScore + peopleScore + timeScore);
  return Math.max(0, Math.min(100, total));
}
