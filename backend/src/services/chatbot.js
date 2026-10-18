// Rule-based chatbot for community help queries.
// No external AI API required.

const PATTERNS = [
  {
    keywords: ['donate', 'donation', 'give', 'give away'],
    response: 'To make a donation, log in as a Donor and go to the Donations page. You can donate food, clothes, medicine, or blood. Click "Create Donation" to get started. You can also give money for an occasion via the Celebrate & Give page — quick give in a minute, no account needed, or start a celebration campaign so friends and family can contribute.',
  },
  {
    keywords: ['request', 'need help', 'help me', 'urgent'],
    response: 'To request help, log in as a Requester and go to the Help Requests page. Click "Create Request" and describe what you need. Emergency requests are prioritized.',
  },
  {
    keywords: ['volunteer', 'volunteer work', 'help others'],
    response: 'To volunteer, sign up as a Volunteer and check the Tasks page. You can accept delivery tasks, pickup tasks, and more. Advance through task stages as you complete them.',
  },
  {
    keywords: ['blood', 'blood donation', 'blood bank'],
    response: 'Blood donations are handled through our hospital network. Donors can pledge blood donations, and hospitals manage blood inventory. Check the Hospitals page for blood bank availability.',
  },
  {
    keywords: ['ngo', 'organization', 'register ngo'],
    response: 'NGOs can register through the Organization Registration page. After registration, an admin will verify your documents. Once approved, you can accept donations and manage requests.',
  },
  {
    keywords: ['hospital', 'medical', 'medicine'],
    response: 'Hospitals can register to manage blood bank inventory and medicine support. After admin verification, hospitals can receive donations and post requirements.',
  },
  {
    keywords: ['emergency', 'critical', 'immediately'],
    response: 'For emergencies, create a request with "Critical" urgency. This gives it the highest priority score and it will appear at the top of the queue. NGOs and volunteers will be notified.',
  },
  {
    keywords: ['status', 'track', 'where', 'progress'],
    response: 'You can track the status of your donations and requests from the respective pages. Each item shows its current status (pending, accepted, in transit, completed, etc.).',
  },
  {
    keywords: ['account', 'login', 'password', 'register'],
    response: 'You can register with different roles: Donor, Volunteer, Requester, NGO, or Hospital. Use the login page to sign in. If you forgot your password, use the "Forgot Password" link.',
  },
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening'],
    response: 'Hello! Welcome to Smart Community Help Hub. I can help you with questions about donations, requests, volunteering, NGOs, hospitals, and more. What would you like to know?',
  },
  {
    keywords: ['celebrate', 'celebration', 'occasion', 'quick give', 'birthday give', 'wedding give', 'in memory'],
    response: 'The Celebrate & Give page lets you turn any occasion — a birthday, wedding, graduation, new job, or in memory of someone — into a moment of hope. Pick a verified NGO and a cause (food, clothes, medicine, or blood), then either Quick Give or create a campaign so friends and family can contribute. Contributions start at ₹10.',
  },
  {
    keywords: ['quick give', 'give in a minute', 'donate money'],
    response: 'Quick Give is the fastest way to support a verified NGO for any occasion — no account, no campaign needed. Pick an occasion, choose a cause and NGO, enter an amount (₹10 to ₹1,00,000), and confirm. You get a payment receipt instantly.',
  },
  {
    keywords: ['thank', 'thanks'],
    response: 'You are welcome! Happy to help. Is there anything else you would like to know about the platform?',
  },
  {
    keywords: ['how', 'what is', 'about', 'about this'],
    response: 'Smart Community Help Hub connects donors, NGOs, hospitals, volunteers, and people in need. Donors can give food, clothes, medicine, or blood. Requesters can ask for help. NGOs and hospitals verify and distribute. Volunteers handle deliveries.',
  },
];

const FALLBACK = {
  response: 'I am not sure how to help with that. I can assist with questions about donations, help requests, volunteering, NGO/hospital registration, blood donations, emergency requests, and account management. Please try asking about one of these topics.',
};

export function getChatbotResponse(message) {
  const lower = String(message).toLowerCase().trim();

  if (!lower) {
    return { response: 'Please type a question and I will do my best to help!' };
  }

  for (const pattern of PATTERNS) {
    if (pattern.keywords.some((kw) => lower.includes(kw))) {
      return { response: pattern.response };
    }
  }

  return { response: FALLBACK.response };
}
