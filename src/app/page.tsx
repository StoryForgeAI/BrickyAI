import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Pillars from "@/components/Pillars";
import AICoding from "@/components/AICoding";
import PluginCreator from "@/components/PluginCreator";
import HowItWorks from "@/components/HowItWorks";
import PluginInstall from "@/components/PluginInstall";
import Features from "@/components/Features";
import Audience from "@/components/Audience";
import CommandSystem from "@/components/CommandSystem";
import AIProviders from "@/components/AIProviders";
import Security from "@/components/Security";
import Showcase from "@/components/Showcase";
import Faq from "@/components/Faq";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Pillars />
      <AICoding />
      <PluginCreator />
      <HowItWorks />
      <PluginInstall />
      <Features />
      <Audience />
      <CommandSystem />
      <AIProviders />
      <Security />
      <Showcase />
      <Faq />
      <CTA />
    </>
  );
}