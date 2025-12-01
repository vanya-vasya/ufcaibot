import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import OddsSlider from "@/components/landing/odds-slider";
import Products from "@/components/landing/products";
import Pricing from "@/components/landing/pricing";

const LandingPage = () => {
  return (
    <div className="bg-slate-50">
      <Hero />
      <Features />
      <OddsSlider />
      <Products />
      <Pricing />
    </div>
  );
};

export default LandingPage;
