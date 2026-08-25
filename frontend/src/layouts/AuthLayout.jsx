import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartHandshake, ShieldCheck, Users, HandHeart } from 'lucide-react';
import { PATHS } from '../routes/paths';
import PageTransition from '../components/shared/PageTransition';
import CountUp from '../components/ui/CountUp';
import RegisterVisual from '../components/auth/RegisterVisual';
import LoginVisual from '../components/auth/LoginVisual';

export default function AuthLayout() {
  const location = useLocation();
  const isRegister = location.pathname === PATHS.REGISTER;
  const isLogin = location.pathname === PATHS.LOGIN;

  if (isRegister || isLogin) {
    return (
      <div className="relative flex min-h-screen flex-col bg-surface-light dark:bg-surface-dark lg:grid lg:grid-cols-[55fr_45fr]">
        {/* Vertical divider with soft teal glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-[55%] hidden w-px lg:block"
        >
          <div className="h-full w-px bg-gradient-to-b from-transparent via-teal-400/60 to-transparent" />
          <div className="absolute -left-3 top-1/2 h-40 w-7 -translate-y-1/2 bg-teal-400/20 blur-2xl" />
        </div>

        {/* Left — Community visual (55%) — below card on mobile, left on desktop */}
        <div className="order-2 lg:order-1 lg:block">
          {isRegister ? <RegisterVisual /> : <LoginVisual />}
        </div>

        {/* Right — Auth card (45%) — first on mobile */}
        <div className="order-1 flex items-center justify-center p-6 sm:p-10 lg:order-2">
          <div className={isRegister ? 'w-full max-w-[520px]' : 'w-full max-w-[480px]'}>
            <PageTransition />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-surface-light dark:bg-surface-dark">
      <div className="relative hidden lg:flex flex-col justify-between p-10 overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-teal-800">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 0, transparent 35%), radial-gradient(circle at 80% 60%, white 0, transparent 30%)' }} />

        {/* Animated decorative blurred shapes */}
        <motion.div
          aria-hidden="true"
          className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-amber-300/20 blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, 15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute bottom-10 -left-16 w-80 h-80 rounded-full bg-coral-300/15 blur-3xl"
          animate={{ x: [0, -15, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link to={PATHS.HOME} className="relative flex items-center gap-2.5 text-white">
            <div className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <span className="font-display font-bold">Smart Community Help Hub</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative glass-panel rounded-3xl p-8 text-white max-w-md"
        >
          <h2 className="font-display text-2xl font-bold leading-snug">
            Every donation, every hand raised, builds a stronger community.
          </h2>
          <p className="text-teal-50/80 text-sm mt-3">
            Join thousands of donors, NGOs, hospitals and volunteers working together to respond faster to real community needs.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div>
              <CountUp value="12k+" className="block font-display text-2xl font-bold" />
              <p className="text-xs text-teal-50/70">Donations</p>
            </div>
            <div>
              <CountUp value="450+" className="block font-display text-2xl font-bold" />
              <p className="text-xs text-teal-50/70">Verified NGOs</p>
            </div>
            <div>
              <CountUp value="30k+" className="block font-display text-2xl font-bold" />
              <p className="text-xs text-teal-50/70">People Helped</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="relative flex items-center gap-6 text-teal-50/80 text-xs"
        >
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Verified organizations</span>
          <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> Community-driven</span>
          <span className="flex items-center gap-1.5"><HandHeart className="w-4 h-4" /> Trusted since 2024</span>
        </motion.div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <PageTransition />
        </div>
      </div>
    </div>
  );
}
