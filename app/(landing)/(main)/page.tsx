import Hero from "@/components/landing/hero";
import Products from "@/components/landing/products";
import Pricing from "@/components/landing/pricing";

const LandingPage = () => {
  return (
    <div className="bg-slate-50">
      <Hero />
      <Products />
      <Pricing />
    </div>
  );
};

export default LandingPage;
