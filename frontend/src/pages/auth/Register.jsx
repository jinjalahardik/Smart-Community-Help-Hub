import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { HandHeart, UserCheck, Siren, Building2, Cross, Check, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Toggle';
import { Switch } from '../../components/ui/Toggle';
import FileUpload from '../../components/forms/FileUpload';
import SignupCard from '../../components/auth/SignupCard';
import RoleSelector from '../../components/auth/RoleSelector';
import { basicRegisterSchema, ngoRegisterSchema, hospitalRegisterSchema } from '../../validators/authSchemas';
import { authService } from '../../features/auth/authService';
import { ROLES } from '../../constants/roles';
import { DONATION_CATEGORY_LABELS, INDIAN_CITIES } from '../../constants/categories';
import { PATHS } from '../../routes/paths';
import { cn } from '../../utils/cn';

const ROLE_OPTIONS = [
  { role: ROLES.DONOR, label: 'Donor', desc: 'Give resources to people in need', icon: HandHeart },
  { role: ROLES.VOLUNTEER, label: 'Volunteer', desc: 'Help deliver support where it matters', icon: UserCheck },
  { role: ROLES.REQUESTER, label: 'Requester', desc: 'Request help when you need it', icon: Siren },
  { role: ROLES.NGO, label: 'NGO', desc: 'Coordinate community assistance', icon: Building2 },
  { role: ROLES.HOSPITAL, label: 'Hospital', desc: 'Coordinate medical support', icon: Cross },
];

const cityOptions = INDIAN_CITIES.map((c) => ({ value: c, label: c }));
const categoryOptions = Object.entries(DONATION_CATEGORY_LABELS).map(([value, label]) => ({ value, label }));

const inputGlass = 'bg-white/75 dark:bg-teal-950/35 backdrop-blur-sm';

export default function Register() {
  const [role, setRole] = useState(null);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const isOrg = role === ROLES.NGO || role === ROLES.HOSPITAL;
  const schema = role === ROLES.NGO ? ngoRegisterSchema : role === ROLES.HOSPITAL ? hospitalRegisterSchema : basicRegisterSchema;

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { serviceCategories: [], bloodBankAvailable: false, medicineSupportAvailable: false, agreeTerms: false, password: '', confirmPassword: '' },
  });

  const totalSteps = isOrg ? 3 : 2;
  const selectedCategories = watch('serviceCategories') || [];

  const toggleCategory = (val) => {
    const next = selectedCategories.includes(val) ? selectedCategories.filter((c) => c !== val) : [...selectedCategories, val];
    setValue('serviceCategories', next);
  };

  const onSubmit = async (data) => {
    try {
      if (isOrg) {
        await authService.registerOrg({ ...data, role });
        toast.success('Registration submitted for verification!');
        navigate(role === ROLES.NGO ? PATHS.PENDING_NGO : PATHS.PENDING_HOSPITAL);
      } else {
        const registered = await authService.registerBasic({ ...data, role });
        const verifiedEmail = registered.user?.email || data.email;
        toast.success('Account created! Please verify your email.');
        navigate(PATHS.VERIFY_EMAIL, { state: { email: verifiedEmail, mode: 'register' } });
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    }
  };

  const roleLabel = ROLE_OPTIONS.find((o) => o.role === role)?.label;

  return (
    <SignupCard>
      {!role ? (
        <div>
          <div className="mb-5 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-300/40 bg-teal-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-teal-700 dark:border-teal-400/25 dark:text-teal-300">
              <ShieldCheck className="h-3 w-3" aria-hidden="true" />
              Choose your role
            </span>
          </div>
          <p className="text-sm text-ink-light/70 dark:text-ink-dark/70">How would you like to participate?</p>
          <RoleSelector
            className="mt-4"
            options={ROLE_OPTIONS}
            value={role}
            onSelect={(r) => {
              setRole(r);
              setStep(1);
            }}
          />
          <p className="mt-6 text-sm text-center text-ink-light/60 dark:text-ink-dark/60">
            Already have an account? <Link to={PATHS.LOGIN} className="font-medium text-teal-600 dark:text-teal-300 hover:underline hover:text-teal-700 dark:hover:text-teal-200 transition-colors">Log in</Link>
          </p>
        </div>
      ) : (
        <div>
          <motion.button
            type="button"
            onClick={() => setRole(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-teal-600 dark:text-teal-300 hover:text-teal-700 dark:hover:text-teal-200 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Change role
          </motion.button>
          <h2 className="font-display text-lg font-bold text-ink-light dark:text-ink-dark">
            Register as {roleLabel}
          </h2>

          <div className="flex items-center gap-2 mt-3 mb-5">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
              <div key={s} className="h-1.5 flex-1 rounded-full bg-teal-100 overflow-hidden dark:bg-teal-900/60">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400"
                  initial={false}
                  animate={{ width: s <= step ? '100%' : '0%' }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={step}
              onSubmit={handleSubmit(onSubmit)}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
            {step === 1 && (
              <>
                {isOrg ? (
                  <>
                    <Input label={role === ROLES.NGO ? 'Organization Name' : 'Hospital Name'} required {...register('orgName')} error={errors.orgName?.message} className={inputGlass} />
                    <Input label={role === ROLES.NGO ? 'Registration Number' : 'License Number'} required {...register(role === ROLES.NGO ? 'registrationNumber' : 'licenseNumber')} error={(role === ROLES.NGO ? errors.registrationNumber : errors.licenseNumber)?.message} className={inputGlass} />
                    <Input label="Contact Person" required {...register('contactPerson')} error={errors.contactPerson?.message} className={inputGlass} />
                  </>
                ) : (
                  <Input label="Full Name" required {...register('name')} error={errors.name?.message} className={inputGlass} />
                )}
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Email Address" type="email" required {...register('email')} error={errors.email?.message} className={inputGlass} />
                  <Input label="Phone Number" required {...register('phone')} error={errors.phone?.message} className={inputGlass} />
                </div>
                {isOrg && <Input label="Address" required {...register('address')} error={errors.address?.message} className={inputGlass} />}
                <Select label="City" required options={cityOptions} {...register('city')} error={errors.city?.message} />
                <Button type="button" className="w-full" onClick={() => setStep(2)} icon={ArrowRight} iconPosition="right">Continue</Button>
              </>
            )}

            {step === 2 && !isOrg && (
              <>
                <PasswordInput label="Password" required showStrength value={watch('password')} {...register('password')} error={errors.password?.message} />
                <PasswordInput label="Confirm Password" required {...register('confirmPassword')} error={errors.confirmPassword?.message} />
                <Checkbox label="I agree to the Terms and Conditions and Privacy Policy" {...register('agreeTerms')} error={errors.agreeTerms?.message} />
                <div className="flex gap-3">
                  <Button type="button" variant="ghost" onClick={() => setStep(1)} icon={ArrowLeft}>Back</Button>
                  <Button type="submit" className="flex-1" loading={isSubmitting}>Create Account</Button>
                </div>
              </>
            )}

            {step === 2 && isOrg && role === ROLES.NGO && (
              <>
                <div>
                  <p className="text-sm font-medium mb-2">Service Categories <span className="text-coral-500">*</span></p>
                  <div className="grid grid-cols-2 gap-2">
                    {categoryOptions.map((opt) => (
                      <button
                        type="button"
                        key={opt.value}
                        onClick={() => toggleCategory(opt.value)}
                        className={cn('px-3 py-2.5 rounded-xl border text-sm text-left flex items-center gap-2 transition-all duration-200', selectedCategories.includes(opt.value) ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/40 shadow-[0_0_12px_rgba(45,212,191,0.18)]' : 'border-teal-100 dark:border-teal-900/60 hover:border-teal-400/60')}
                      >
                        {selectedCategories.includes(opt.value) && <Check className="w-3.5 h-3.5 text-teal-600" />}
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {errors.serviceCategories && <p className="mt-1.5 text-xs text-coral-600">{errors.serviceCategories.message}</p>}
                </div>
                <Input label="Service Radius (km)" type="number" required {...register('serviceRadius')} error={errors.serviceRadius?.message} className={inputGlass} />
                <div className="flex gap-3">
                  <Button type="button" variant="ghost" onClick={() => setStep(1)} icon={ArrowLeft}>Back</Button>
                  <Button type="button" className="flex-1" onClick={() => setStep(3)} icon={ArrowRight} iconPosition="right">Continue</Button>
                </div>
              </>
            )}

            {step === 2 && isOrg && role === ROLES.HOSPITAL && (
              <>
                <Switch checked={watch('bloodBankAvailable')} onChange={(v) => setValue('bloodBankAvailable', v)} label="Blood bank available" />
                <Switch checked={watch('medicineSupportAvailable')} onChange={(v) => setValue('medicineSupportAvailable', v)} label="Medicine support available" />
                <div className="flex gap-3">
                  <Button type="button" variant="ghost" onClick={() => setStep(1)} icon={ArrowLeft}>Back</Button>
                  <Button type="button" className="flex-1" onClick={() => setStep(3)} icon={ArrowRight} iconPosition="right">Continue</Button>
                </div>
              </>
            )}

            {step === 3 && isOrg && (
              <>
                <FileUpload label={role === ROLES.NGO ? 'Registration Certificate' : 'License Document'} hint="PDF, JPG or PNG up to 5MB" required />
                {role === ROLES.NGO && <FileUpload label="Identity Document" hint="PDF, JPG or PNG up to 5MB" required />}
                <PasswordInput label="Password" required showStrength value={watch('password')} {...register('password')} error={errors.password?.message} />
                <PasswordInput label="Confirm Password" required {...register('confirmPassword')} error={errors.confirmPassword?.message} />
                <div className="flex gap-3">
                  <Button type="button" variant="ghost" onClick={() => setStep(2)} icon={ArrowLeft}>Back</Button>
                  <Button type="submit" className="flex-1" loading={isSubmitting}>Submit for Verification</Button>
                </div>
              </>
            )}
          </motion.form>
          </AnimatePresence>

          <p className="text-sm text-center text-ink-light/60 dark:text-ink-dark/60 mt-6">
            Already have an account? <Link to={PATHS.LOGIN} className="font-medium text-teal-600 dark:text-teal-300 hover:underline hover:text-teal-700 dark:hover:text-teal-200 transition-colors">Log in</Link>
          </p>
        </div>
      )}
    </SignupCard>
  );
}
