import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import HomeEvents from "@/components/landing/home-events";
import Products from "@/components/landing/products";
import TwitterSlider from "@/components/landing/twitter-slider";
import Pricing from "@/components/landing/pricing";

const LandingPage = () => {
  return (
    <div className="bg-slate-50">
      <HomeEvents />
      <Hero />
      <Features />
      <Products />
      <TwitterSlider />
      <Pricing />
    </div>
  );
};

export default LandingPage;
