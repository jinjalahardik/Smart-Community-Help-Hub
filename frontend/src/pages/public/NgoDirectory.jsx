import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, MapPin, LayoutGrid, List, Building2, Phone, Mail } from 'lucide-react';
import Section, { SectionHeading } from '../../components/shared/Section';
import { Card } from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
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

  // Simulated initial fetch delay so the skeleton state has something to show
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 550);
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
    <Section className="pt-14">
      <Reveal><SectionHeading eyebrow="Trusted network" title="NGO & Hospital Directory" description="Every organization listed here has completed document verification with our admin team." /></Reveal>

      <Reveal delay={0.1}>
        <div className="flex flex-col gap-3 mb-8 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchInput value={search} onChange={setSearch} placeholder="Search organizations..." className="flex-1" />
            <Select value={city} onChange={(e) => setCity(e.target.value)} placeholder="All cities" options={INDIAN_CITIES.map((c) => ({ value: c, label: c }))} containerClassName="sm:w-44" />
            <Select value={category} onChange={(e) => setCategory(e.target.value)} placeholder="All categories" options={Object.entries(DONATION_CATEGORY_LABELS).map(([value, label]) => ({ value, label }))} containerClassName="sm:w-44" />
          </div>
          <div className="flex items-center justify-between gap-3">
            <Select value={sort} onChange={(e) => setSort(e.target.value)} options={SORT_OPTIONS} containerClassName="w-48" />
            <div className="flex items-center gap-1 rounded-xl border border-teal-100 dark:border-teal-900/60 p-1" role="group" aria-label="Toggle view">
              <button
                onClick={() => setView('grid')}
                aria-pressed={view === 'grid'}
                aria-label="Grid view"
                className={cn('p-1.5 rounded-lg transition-colors', view === 'grid' ? 'bg-teal-600 text-white' : 'text-ink-light/65 hover:bg-teal-50 dark:hover:bg-teal-900/40')}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('list')}
                aria-pressed={view === 'list'}
                aria-label="List view"
                className={cn('p-1.5 rounded-lg transition-colors', view === 'list' ? 'bg-teal-600 text-white' : 'text-ink-light/65 hover:bg-teal-50 dark:hover:bg-teal-900/40')}
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
        <motion.div layout className={view === 'grid' ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-3'}>
          <AnimatePresence mode="popLayout">
            {filtered.map((n) => (
              <motion.div
                key={n.name}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <Card
                  hover
                  onClick={() => setDetail(n)}
                  className={cn('cursor-pointer', view === 'grid' ? 'p-6 h-full' : 'p-5 flex items-center gap-4')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setDetail(n)}
                >
                  <div className={view === 'list' ? 'flex items-center gap-4 flex-1 min-w-0' : ''}>
                    <div className={cn('flex items-center gap-3', view === 'grid' && 'mb-3')}>
                      <Avatar name={n.name} />
                      <div className="min-w-0">
                        <p className="font-display font-semibold text-sm truncate">{n.name}</p>
                        <p className="text-xs text-ink-light/65 dark:text-ink-dark/65 flex items-center gap-1"><MapPin className="w-3 h-3" /> {n.city} • {n.distanceKm} km away</p>
                      </div>
                    </div>
                    {view === 'grid' && <p className="text-sm text-ink-light/60 dark:text-ink-dark/60">{n.desc}</p>}
                  </div>
                  <div className={cn('flex flex-wrap gap-1.5', view === 'grid' ? 'mt-3' : 'shrink-0')}>
                    {n.categories.map((c) => <Badge key={c} tone="teal">{DONATION_CATEGORY_LABELS[c]}</Badge>)}
                  </div>
                  {view === 'grid' && (
                    <span className="inline-flex items-center gap-1 text-xs text-teal-600 mt-3"><ShieldCheck className="w-3.5 h-3.5" /> Verified • {n.radius}km service radius</span>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.name} size="md">
        {detail && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar name={detail.name} size="lg" />
              <div>
                <p className="font-display font-semibold">{detail.name}</p>
                <span className="inline-flex items-center gap-1 text-xs text-teal-600"><ShieldCheck className="w-3.5 h-3.5" /> Verified {detail.isHospital ? 'Hospital' : 'NGO'}</span>
              </div>
            </div>
            <p className="text-sm text-ink-light/70 dark:text-ink-dark/70">{detail.desc}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-teal-600" /> {detail.city}</div>
              <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-teal-600" /> {detail.radius}km radius</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-teal-600" /> {detail.phone}</div>
              <div className="flex items-center gap-2 truncate"><Mail className="w-4 h-4 text-teal-600 shrink-0" /> {detail.email}</div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {detail.categories.map((c) => <Badge key={c} tone="teal">{DONATION_CATEGORY_LABELS[c]}</Badge>)}
            </div>
          </div>
        )}
      </Modal>
    </Section>
  );
}
