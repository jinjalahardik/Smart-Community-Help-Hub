// Celebration occasion background images (Quick Give step 1 cards) - w=600 h=400
export const celebrationImages = {
  // Birthday cake with lit candles - joyful, warm, celebratory
  birthday: 'https://images.unsplash.com/photo-1727877033523-7cd49318bb6e?w=600&h=400&fit=crop&q=80',
  // Couple celebrating anniversary, years together, romantic, giving back
  anniversary: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop&q=80',
  // Graduation caps thrown in the air, big milestone, students
  graduation: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=400&fit=crop&q=80',
  // Person in an office with a briefcase, new role celebration
  newJob: 'https://images.unsplash.com/photo-1758876017817-15b53881acf7?w=600&h=400&fit=crop&q=80',
  // Row of golden trophies, win, achievement unlocked
  achievement: 'https://images.unsplash.com/photo-1663658110043-b231f541dcae?w=600&h=400&fit=crop&q=80',
  // Indian wedding couple, sharing joy, married life start
  wedding: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop&q=80',
  // House keys and a new home, housewarming, blessing community
  newHome: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop&q=80',
  // Lit diyas in the dark, Diwali festival, gift of hope
  festival: 'https://images.unsplash.com/photo-1757693350857-61d31a1b77bf?w=600&h=400&fit=crop&q=80',
  // Single lit candle, in memory, peaceful lasting tribute
  inMemory: 'https://images.unsplash.com/photo-1774608426611-c1f939720487?w=600&h=400&fit=crop&q=80',
  // Pink and white balloons, personal milestone celebration
  personalMilestone: 'https://images.unsplash.com/photo-1768776182359-75ecacc8735d?w=600&h=400&fit=crop&q=80',
  // Hands giving in kindness, random act, spreading love
  justBecause: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop&q=80',
  // Family and friends together, group, loved ones
  familyFriends: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop&q=80',
};

// Maps a Quick Give occasion value to its background image.
export const occasionImage = (value) => ({
  birthday: celebrationImages.birthday,
  anniversary: celebrationImages.anniversary,
  graduation: celebrationImages.graduation,
  newjob: celebrationImages.newJob,
  achievement: celebrationImages.achievement,
  wedding: celebrationImages.wedding,
  newhome: celebrationImages.newHome,
  festival: celebrationImages.festival,
  inmemory: celebrationImages.inMemory,
  milestone: celebrationImages.personalMilestone,
  justbecause: celebrationImages.justBecause,
  family: celebrationImages.familyFriends,
}[value]);