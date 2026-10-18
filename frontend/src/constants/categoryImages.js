import medicineHero from '../assets/images/medicine-hero.png';
import foodHero from '../assets/images/food-hero.png';
import clothesHero from '../assets/images/clothes-hero.png';
import bloodHero from '../assets/images/blood-hero.jpg';
import food1 from '../assets/images/food1.png';
import clothes1 from '../assets/images/clothes1.png';
import blood1 from '../assets/images/blood1.avif';
// Small hero cards (2x2 grid) - w=600 h=400
export const categoryImages = {
  medicine: medicineHero,
  food: foodHero,
  clothes: clothesHero,
  blood: bloodHero,
};

// Large donation category cards - w=800 h=500
export const categoryImagesLarge = {
  food: food1,
  clothes: clothes1,
  medicine: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&h=500&fit=crop',
  blood: blood1,
};