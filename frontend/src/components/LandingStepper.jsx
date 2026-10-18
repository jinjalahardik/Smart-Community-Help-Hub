import { LandingStepCards } from './HowItWorksCards';

export default function LandingStepper({ activeStep = 1 }) {
  return <LandingStepCards activeStep={activeStep} />;
}
