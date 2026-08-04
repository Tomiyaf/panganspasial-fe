import HeroSection from '../components/home/HeroSection';
import InteractiveMapSection from '../components/home/InteractiveMapSection';
import ValuePropSection from '../components/home/ValuePropSection';

export default function HomePage() {
  return (
    <main className="w-full bg-slate-50 overflow-hidden">
      <HeroSection />
      <InteractiveMapSection />
      <ValuePropSection />
      {/* <CapabilitiesSection />*/}
    </main>
  );
}
