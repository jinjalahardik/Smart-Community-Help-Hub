import { Link } from 'react-router-dom';
import { HeartHandshake, Share2, MessageCircle, Camera, Briefcase, Mail } from 'lucide-react';
import { PATHS } from '../../routes/paths';

const COLS = [
  {
    title: 'Platform',
    links: [
      { label: 'About Us', to: PATHS.ABOUT },
      { label: 'How It Works', to: PATHS.HOW_IT_WORKS },
      { label: 'Donation Categories', to: PATHS.CATEGORIES },
      { label: 'NGO Directory', to: PATHS.NGOS },
    ],
  },
  {
    title: 'Get Involved',
    links: [
      { label: 'Volunteer', to: PATHS.VOLUNTEER_INFO },
      { label: 'Emergency Help', to: PATHS.EMERGENCY_INFO },
      { label: 'Register', to: PATHS.REGISTER },
      { label: 'Contact Us', to: PATHS.CONTACT },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'FAQ', to: PATHS.FAQ },
      { label: 'Privacy Policy', to: PATHS.PRIVACY },
      { label: 'Terms & Conditions', to: PATHS.TERMS },
    ],
  },
];

export default function PublicFooter() {
  return (
    <footer className="bg-teal-950 text-teal-50 mt-20">
      <div className="container-app py-14 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold">Smart Community Help Hub</span>
          </div>
          <p className="text-sm text-teal-200/80 max-w-xs">
            Connecting donors, NGOs, hospitals, volunteers and requesters to build a stronger, more responsive community support network across India.
          </p>
          <div className="flex items-center gap-3 mt-5">
            {[Share2, MessageCircle, Camera, Briefcase, Mail].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Social link">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
        {COLS.map((col) => (
          <div key={col.title}>
            <p className="font-display font-semibold text-sm mb-3">{col.title}</p>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-teal-200/80 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-teal-200/60">
        © {new Date().getFullYear()} Smart Community Help Hub. All rights reserved.
      </div>
    </footer>
  );
}
