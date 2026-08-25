// Lightweight, fully local "AI" knowledge base for the Smart Community
// Help Hub chat assistant. Since this build has no real backend/LLM, the
// assistant works by keyword-matching the user's message against a set of
// topic entries below and returning a curated answer. This keeps the
// assistant on-topic by construction (it can only ever say what's written
// here) and requires no API keys or network calls.

export const FALLBACK_RESPONSE =
  "I'm designed to help with Smart Community Help Hub. Please ask questions related to donations, volunteers, NGOs, hospitals or emergency requests.";

export const GREETING_RESPONSES = [
  "Hi there! 👋 I'm the Smart Community AI Assistant. I can help you with donations, emergency requests, volunteering, NGO/hospital registration and more. What would you like to know?",
];

const TOPICS = [
  {
    id: 'donate',
    keywords: ['donate', 'donation', 'how can i donate', 'give', 'contribute', 'start a donation'],
    answer:
      "To donate:\n1. Go to **Donate** in the navbar or sign up as a Donor.\n2. Choose a category — Food, Clothes, Medicine or Blood.\n3. Fill in the guided form (quantity, pickup address, preferred pickup time).\n4. A nearby verified NGO accepts it, and a volunteer picks it up.\n\nYou can create a donation any time from your **Donor Dashboard → Create Donation**.",
  },
  {
    id: 'food-donation',
    keywords: ['food donation', 'food', 'meal', 'ration', 'cooked food'],
    answer:
      "For **Food donations** you can list cooked meals or dry ration kits. Please make sure perishable food is hygienically packaged and picked up the same day. You'll specify food type, quantity, and whether it's vegetarian/non-vegetarian in the donation form.",
  },
  {
    id: 'clothes-donation',
    keywords: ['clothes donation', 'clothes', 'clothing', 'garments'],
    answer:
      "For **Clothes donations**, list clean, gently-used clothing by gender, age group, size and season. NGOs sort and distribute these to families in need.",
  },
  {
    id: 'medicine-donation',
    keywords: ['medicine donation', 'medicine', 'medicines', 'drugs', 'pharmacy rules'],
    answer:
      "**Medicine donation rules:**\n- Medicines must be **unexpired and sealed**.\n- You'll need to provide the batch number and manufacturer.\n- Prescription medicines are flagged separately.\n- Expired or opened medication cannot be accepted.\n\nThese go to hospitals and NGO health camps for review before distribution.",
  },
  {
    id: 'blood-donation',
    keywords: ['blood donation', 'blood', 'blood group', 'donate blood'],
    answer:
      "**Blood donation process:**\n1. Pledge your blood group and availability on the Donate page.\n2. Confirm medical eligibility (at least 90 days since your last donation).\n3. You'll be matched with a partner hospital's blood bank for the actual donation.\n\nCritical blood requests from hospitals are given top priority routing.",
  },
  {
    id: 'emergency-request',
    keywords: ['emergency', 'emergency request', 'urgent help', 'need help', 'request help', 'raise a request'],
    answer:
      "To raise an **Emergency Request**:\n1. Register or log in as a Requester.\n2. Click **Raise Emergency Request** (also available from the navbar's 'Get Help' button).\n3. Choose a category (Food, Clothes, Medicine, Blood, Shelter, Other) and urgency level (Low/Medium/High/Critical).\n4. Your request gets a priority score and is matched to the nearest capable NGO automatically — critical requests are matched fastest.",
  },
  {
    id: 'track-request',
    keywords: ['track', 'track my request', 'track donation', 'status', 'where is my'],
    answer:
      "You can track any donation or request from your dashboard:\n- Donors: **Donor Dashboard → My Donations**\n- Requesters: **Requester Dashboard → My Requests → Tracking**\n\nEach one shows a live status timeline (e.g. Pending → Accepted → In Transit → Delivered) so you always know what stage it's at.",
  },
  {
    id: 'volunteer',
    keywords: ['volunteer', 'become a volunteer', 'volunteering', 'join as volunteer'],
    answer:
      "To **become a volunteer**:\n1. Register and choose the Volunteer role.\n2. Set your city and availability.\n3. Browse **Nearby Tasks** on your Volunteer Dashboard and accept ones that fit your schedule.\n4. Follow the task workflow: Accepted → Pickup → In Transit → Delivered.\n\nYou'll earn impact hours and achievement badges as you complete tasks!",
  },
  {
    id: 'ngo-registration',
    keywords: ['ngo registration', 'register ngo', 'ngo signup', 'join as ngo', 'ngo directory'],
    answer:
      "**NGO registration:** Choose the NGO role when signing up and provide your organization name, registration number, contact person, address, service categories and service radius, plus your registration certificate and identity document. Our admin team reviews and verifies documents before your account is activated. You can check status any time under **Verification Status**.",
  },
  {
    id: 'hospital-registration',
    keywords: ['hospital registration', 'register hospital', 'hospital signup', 'join as hospital'],
    answer:
      "**Hospital registration:** Choose the Hospital role when signing up and provide your hospital name, license number, contact details, and whether you offer blood bank / medicine support. Upload your license document for admin verification. Once approved, you can publish blood and medicine requirements and manage inventory from your Hospital Dashboard.",
  },
  {
    id: 'dashboard',
    keywords: ['dashboard', 'my dashboard', 'admin dashboard', 'donor dashboard'],
    answer:
      "Every role has its own dashboard reachable after login: Donor, NGO, Volunteer, Requester, Hospital and Admin. Each shows role-specific stats, recent activity, and quick actions — for example, Donors see donation impact, NGOs see incoming donations and inventory, and Volunteers see nearby tasks.",
  },
  {
    id: 'account',
    keywords: ['account', 'profile', 'my account', 'update profile', 'change password'],
    answer:
      "You can manage your account from **Profile** and **Settings** in your dashboard menu — update your name, phone, city, notification preferences, and switch between Light/Dark/System theme.",
  },
  {
    id: 'contact',
    keywords: ['contact', 'contact us', 'support', 'reach you', 'phone number', 'email address'],
    answer:
      "You can reach our team via the **Contact Us** page — email support@helpconnect.demo, call +91 79 4000 1234, or use the contact form. Office hours are Mon–Fri 9AM–7PM and Sat 10AM–4PM; emergency requests are handled 24/7.",
  },
  {
    id: 'privacy',
    keywords: ['privacy', 'privacy policy', 'data', 'personal information'],
    answer:
      "Our **Privacy Policy** explains what information we collect, how it's used to match donations/requests, and that contact details are only shared with the NGO, hospital or volunteer directly handling your donation or request. You can read the full policy on the Privacy page in the footer.",
  },
  {
    id: 'faq',
    keywords: ['faq', 'frequently asked', 'questions'],
    answer:
      "You'll find our full **FAQ** page linked in the footer, covering topics like account verification, priority scoring, editing donations, and volunteer matching. Feel free to ask me directly too!",
  },
  {
    id: 'nearby-ngo',
    keywords: ['nearby ngo', 'find ngo', 'ngo near me', 'ngos'],
    answer:
      "Check the **NGO Directory** page to browse verified NGOs and hospitals — you can filter by city, category, and sort by distance. Every listed organization has completed document verification with our admin team.",
  },
];

function normalize(text) {
  return text.toLowerCase().trim();
}

const GREETING_KEYWORDS = ['hi', 'hello', 'hey', 'good morning', 'good evening', 'good afternoon'];

/**
 * Very small keyword-overlap matcher: scores each topic by how many of its
 * keywords appear as substrings of the user's message, and returns the
 * best-scoring topic's answer. Falls back to the on-topic redirect message
 * when nothing matches meaningfully.
 */
export function getBotResponse(rawMessage) {
  const message = normalize(rawMessage);
  if (!message) return FALLBACK_RESPONSE;

  if (GREETING_KEYWORDS.some((g) => message === g || message.startsWith(g + ' ') || message.startsWith(g + '!'))) {
    return GREETING_RESPONSES[0];
  }

  let best = null;
  let bestScore = 0;
  for (const topic of TOPICS) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (message.includes(kw)) score += kw.split(' ').length; // reward longer/more specific phrase matches
    }
    if (score > bestScore) {
      bestScore = score;
      best = topic;
    }
  }

  return best ? best.answer : FALLBACK_RESPONSE;
}

export const SUGGESTED_QUESTIONS = [
  'How can I donate?',
  'How do I request emergency help?',
  'Become a volunteer',
  'Find nearby NGOs',
  'Medicine donation rules',
  'Blood donation process',
  'Track my request',
];
