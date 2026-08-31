import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Positioning from "@/components/Positioning";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import CommandSystem from "@/components/CommandSystem";
import AIProviders from "@/components/AIProviders";
import Architecture from "@/components/Architecture";
import Showcase from "@/components/Showcase";
import PluginInstall from "@/components/PluginInstall";
import Security from "@/components/Security";
import Faq from "@/components/Faq";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Positioning />
      <HowItWorks />
      <Features />
      <CommandSystem />
      <AIProviders />
      <Architecture />
      <Showcase />
      <PluginInstall />
      <Security />
      <Faq />
      <CTA />
    </>
  );
}
