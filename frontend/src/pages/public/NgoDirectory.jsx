import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, MapPin, LayoutGrid, List, Building2, Phone, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import Section, { SectionHeading } from '../../components/shared/Section';
import { Badge } from '../../components/ui/Badge';
import SearchInput from '../../components/ui/SearchInput';
import Select from '../../components/ui/Select';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import { SkeletonCardGrid } from '../../components/ui/SkeletonCard';
import { INDIAN_CITIES, DONATION_CATEGORY_LABELS } from '../../constants/categories';
import Reveal from '../../components/shared/Reveal';
import { cn } from '../../utils/cn';

const DIRECTORY = [
  { name: 'Asha Seva Foundation', city: 'Ahmedabad', categories: ['food', 'clothes', 'medicine'], radius: 25, distanceKm: 4.2, phone: '9898989898', email: 'contact@ashaseva.demo', desc: 'Serving flood-relief and daily meal programs across Ahmedabad since 2014.' },
  { name: 'Karuna Relief Trust', city: 'Surat', categories: ['food', 'blood'], radius: 15, distanceKm: 1.8, phone: '9877001122', email: 'contact@karunarelief.demo', desc: 'Focused on emergency food distribution and blood donation drives.' },
  { name: 'Manav Seva Sangh', city: 'Pune', categories: ['clothes', 'medicine'], radius: 20, distanceKm: 9.6, phone: '9877001133', email: 'contact@manavseva.demo', desc: 'Provides clothing and medical support to underserved communities in Pune.' },
  { name: 'Rajkot City Care Hospital', city: 'Rajkot', categories: ['blood', 'medicine'], radius: 30, distanceKm: 6.1, phone: '9911223344', email: 'contact@rajkotcare.demo', desc: 'Partner hospital offering blood bank and medicine support services.', isHospital: true },
  { name: 'Sunrise Multispeciality Hospital', city: 'Surat', categories: ['blood'], radius: 20, distanceKm: 3.0, phone: '9911223355', email: 'contact@sunrisehosp.demo', desc: 'Blood bank partner supporting critical requirement fulfilment.', isHospital: true },
];

const SORT_OPTIONS = [
  { value: 'distance', label: 'Nearest first' },
  { value: 'city', label: 'City (A–Z)' },
  { value: 'category', label: 'Most categories' },
];

export default function NgoDirectory() {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('distance');
  const [view, setView] = useState('grid');
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    let list = DIRECTORY.filter((n) => {
      const matchesSearch = n.name.toLowerCase().includes(search.toLowerCase());
      const matchesCity = !city || n.city === city;
      const matchesCategory = !category || n.categories.includes(category);
      return matchesSearch && matchesCity && matchesCategory;
    });
    if (sort === 'distance') list = [...list].sort((a, b) => a.distanceKm - b.distanceKm);
    else if (sort === 'city') list = [...list].sort((a, b) => a.city.localeCompare(b.city));
    else if (sort === 'category') list = [...list].sort((a, b) => b.categories.length - a.categories.length);
    return list;
  }, [search, city, category, sort]);

  return (
    <Section className="pt-16 pb-20">
      <Reveal>
        <SectionHeading
          eyebrow="Trusted network"
          title="NGO & Hospital Directory"
          description="Every organization listed here has completed document verification with our admin team."
        />
      </Reveal>

      {/* PILL-SHAPED SEARCH BAR & FILTER BAR */}
      <Reveal delay={0.1}>
        <div className="p-3 sm:p-4 rounded-[28px] glass-card bg-white/80 dark:bg-surface-elevated/80 border border-teal-200/60 dark:border-teal-400/20 shadow-premium mb-10 max-w-4xl mx-auto backdrop-blur-2xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchInput value={search} onChange={setSearch} placeholder="Search verified organizations..." className="flex-1 rounded-2xl" />
            <Select value={city} onChange={(e) => setCity(e.target.value)} placeholder="All cities" options={INDIAN_CITIES.map((c) => ({ value: c, label: c }))} containerClassName="sm:w-44" />
            <Select value={category} onChange={(e) => setCategory(e.target.value)} placeholder="All categories" options={Object.entries(DONATION_CATEGORY_LABELS).map(([value, label]) => ({ value, label }))} containerClassName="sm:w-44" />
          </div>
          <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-teal-900/10 dark:border-white/10 px-1">
            <Select value={sort} onChange={(e) => setSort(e.target.value)} options={SORT_OPTIONS} containerClassName="w-48" />
            <div className="flex items-center gap-1 rounded-2xl border border-teal-200/50 dark:border-teal-800/60 p-1 bg-teal-50/50 dark:bg-surface-dark/40" role="group" aria-label="Toggle view">
              <button
                onClick={() => setView('grid')}
                aria-pressed={view === 'grid'}
                aria-label="Grid view"
                className={cn('p-1.5 rounded-xl transition-colors', view === 'grid' ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-sm' : 'text-ink-light/65 hover:bg-teal-100/50 dark:hover:bg-teal-900/40')}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('list')}
                aria-pressed={view === 'list'}
                aria-label="List view"
                className={cn('p-1.5 rounded-xl transition-colors', view === 'list' ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-sm' : 'text-ink-light/65 hover:bg-teal-100/50 dark:hover:bg-teal-900/40')}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Reveal>

      {loading ? (
        <SkeletonCardGrid count={6} />
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <EmptyState title="No organizations found" description="Try adjusting your search, city or category filter." />
        </motion.div>
      ) : (
        <motion.div layout className={view === 'grid' ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          <AnimatePresence mode="popLayout">
            {filtered.map((n) => (
              <motion.div
                key={n.name}
                layout
                className="min-w-0"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  onClick={() => setDetail(n)}
                  className={cn(
                    'bento-card p-6 h-full cursor-pointer group border border-teal-200/60 dark:border-teal-800/60 hover:border-teal-400 dark:hover:border-teal-400/60 hover:shadow-card-hover transition-all duration-300 relative overflow-hidden bg-white/90 dark:bg-surface-card/90',
                    view === 'list' && 'flex items-center gap-6 justify-between'
                  )}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setDetail(n)}
                >
                  <div className={view === 'list' ? 'flex items-center gap-4 flex-1 min-w-0' : ''}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {/* Gradient Avatar */}
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 flex items-center justify-center text-white font-display font-extrabold text-lg shadow-glow-teal shrink-0">
                          {n.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-display font-extrabold text-base text-ink-light dark:text-ink-dark truncate group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                            {n.name}
                          </p>
                          <p className="text-xs text-ink-light/65 dark:text-ink-dark/65 flex items-center gap-1.5 mt-0.5">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
                            </span>
                            <MapPin className="w-3 h-3 text-teal-500" /> {n.city} • <span className="font-semibold text-teal-700 dark:text-teal-300">{n.distanceKm} km away</span>
                          </p>
                        </div>
                      </div>

                      {/* Verified Badge Shimmer */}
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-300/40">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" /> Verified
                      </span>
                    </div>

                    {view === 'grid' && (
                      <p className="text-xs text-ink-light/70 dark:text-ink-dark/70 leading-relaxed line-clamp-2">{n.desc}</p>
                    )}
                  </div>

                  <div className={cn('flex flex-wrap gap-1.5', view === 'grid' ? 'mt-4' : 'shrink-0')}>
                    {n.categories.map((c) => (
                      <span key={c} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/40">
                        {DONATION_CATEGORY_LABELS[c]}
                      </span>
                    ))}
                  </div>

                  {view === 'grid' && (
                    <div className="mt-5 pt-4 border-t border-teal-900/10 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-300">
                      <span>{n.radius}km service radius</span>
                      <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        View Profile <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* DETAILED MODAL */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.name} size="md">
        {detail && (
          <div className="space-y-5 p-1">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 flex items-center justify-center text-white font-display font-extrabold text-xl shadow-glow-teal">
                {detail.name.charAt(0)}
              </div>
              <div>
                <p className="font-display font-bold text-lg text-ink-light dark:text-ink-dark">{detail.name}</p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-300">
                  <ShieldCheck className="w-4 h-4 text-teal-500" /> Verified {detail.isHospital ? 'Hospital' : 'NGO'} Partner
                </span>
              </div>
            </div>
            <p className="text-sm text-ink-light/75 dark:text-ink-dark/75 leading-relaxed font-body">{detail.desc}</p>
            <div className="grid grid-cols-2 gap-3 text-sm font-medium">
              <div className="flex items-center gap-2 text-ink-light/80 dark:text-ink-dark/80"><MapPin className="w-4 h-4 text-teal-500" /> {detail.city}</div>
              <div className="flex items-center gap-2 text-ink-light/80 dark:text-ink-dark/80"><Building2 className="w-4 h-4 text-teal-500" /> {detail.radius}km coverage</div>
              <div className="flex items-center gap-2 text-ink-light/80 dark:text-ink-dark/80"><Phone className="w-4 h-4 text-teal-500" /> {detail.phone}</div>
              <div className="flex items-center gap-2 truncate text-ink-light/80 dark:text-ink-dark/80"><Mail className="w-4 h-4 text-teal-500 shrink-0" /> {detail.email}</div>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {detail.categories.map((c) => <Badge key={c} tone="teal">{DONATION_CATEGORY_LABELS[c]}</Badge>)}
            </div>
          </div>
        )}
      </Modal>
    </Section>
  );
}
