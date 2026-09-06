import Hero from "@/components/Hero";
import Results from "@/components/Results";
import UseCases from "@/components/UseCases";
import Showcase from "@/components/Showcase";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Results />
      <UseCases />
      <Showcase />
      <HowItWorks />
      <Pricing />
      <Faq />
      <CTA />
    </>
  );
}