import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import LegalSection from "@/components/legal/LegalSection";
import CompanyInfo from "@/components/legal/CompanyInfo";
import { companyInfo } from "@/lib/company";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Terms of Service — Bricky AI",
  description:
    "The Terms of Service that apply when you use Bricky AI, the independent AI-powered Roblox Studio plugin development tool.",
};

const TOC = [
  { id: "sec-1", num: "1", label: "Introduction" },
  { id: "sec-2", num: "2", label: "Definitions" },
  { id: "sec-3", num: "3", label: "Eligibility and age requirements" },
  { id: "sec-4", num: "4", label: "Account creation" },
  { id: "sec-5", num: "5", label: "Google login / authentication" },
  { id: "sec-6", num: "6", label: "Account security" },
  { id: "sec-7", num: "7", label: "Bricky AI services" },
  { id: "sec-8", num: "8", label: "AI-generated code and outputs" },
  { id: "sec-9", num: "9", label: "User inputs, prompts and content" },
  { id: "sec-10", num: "10", label: "Ownership of user content" },
  { id: "sec-11", num: "11", label: "Rights to generated outputs" },
  { id: "sec-12", num: "12", label: "AI limitations" },
  { id: "sec-13", num: "13", label: "Roblox / Roblox Studio disclaimer" },
  { id: "sec-14", num: "14", label: "Plugin creation" },
  { id: "sec-15", num: "15", label: "Desktop application capabilities" },
  { id: "sec-16", num: "16", label: "Local computer interaction" },
  { id: "sec-17", num: "17", label: "User responsibility for generated code" },
  { id: "sec-18", num: "18", label: "Acceptable use" },
  { id: "sec-19", num: "19", label: "Prohibited activities" },
  { id: "sec-20", num: "20", label: "Malware / harmful code restrictions" },
  { id: "sec-21", num: "21", label: "Abuse, automation and attacks" },
  { id: "sec-22", num: "22", label: "Intellectual property" },
  { id: "sec-23", num: "23", label: "Copyright complaints" },
  { id: "sec-24", num: "24", label: "Third-party services" },
  { id: "sec-25", num: "25", label: "Third-party AI providers" },
  { id: "sec-26", num: "26", label: "Subscriptions" },
  { id: "sec-27", num: "27", label: "Credits / usage limits" },
  { id: "sec-28", num: "28", label: "Payments and billing" },
  { id: "sec-29", num: "29", label: "Refund policy" },
  { id: "sec-30", num: "30", label: "Service availability" },
  { id: "sec-31", num: "31", label: "Maintenance and changes" },
  { id: "sec-32", num: "32", label: "Account suspension and termination" },
  { id: "sec-33", num: "33", label: "User-requested account deletion" },
  { id: "sec-34", num: "34", label: "Privacy Policy reference" },
  { id: "sec-35", num: "35", label: "Data security disclaimer" },
  { id: "sec-36", num: "36", label: "AI accuracy disclaimer" },
  { id: "sec-37", num: "37", label: "No professional advice" },
  { id: "sec-38", num: "38", label: "Limitation of liability" },
  { id: "sec-39", num: "39", label: "Indemnification" },
  { id: "sec-40", num: "40", label: "Governing law and disputes" },
  { id: "sec-41", num: "41", label: "International users" },
  { id: "sec-42", num: "42", label: "Changes to the Terms" },
  { id: "sec-43", num: "43", label: "Severability" },
  { id: "sec-44", num: "44", label: "Entire agreement" },
  { id: "sec-45", num: "45", label: "Contact information" },
];

export default function TermsPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Terms of Service"
      lastUpdated="September 5, 2026"
      intro={
        <>
          These Terms of Service (&ldquo;Terms&rdquo;) are a binding agreement between you
          (&ldquo;you&rdquo;, &ldquo;your&rdquo;) and <strong>{companyInfo.operatorName}</strong> (the
          operator of {siteConfig.name}, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). Please read them
          carefully. By creating an account, downloading, installing or using{" "}
          {siteConfig.name}, you agree to these Terms. If you do not agree, do
          not use the service.
        </>
      }
      toc={TOC}
      companion={{
        href: "/privacy",
        label: "Privacy Policy",
        description:
          "Our Privacy Policy explains what information we process, why, and the rights you have. It applies whenever you use Bricky AI. You can read the",
      }}
    >
      <LegalSection id="sec-1" num="1" title="Introduction">
        <p>
          {siteConfig.name} is an independent, AI-powered desktop development
          tool for creating and improving Roblox Studio plugins and Roblox
          code. It connects an AI assistant to your local development workflow,
          and, where you enable it, to Roblox Studio through a plugin.
        </p>
        <p>
          These Terms govern your use of the {siteConfig.name} website, desktop
          application, Roblox Studio plugin, and any related services we
          provide (together, the &ldquo;Service&rdquo;).
        </p>
        <p>
          {siteConfig.name} is <strong>not</strong> owned by, affiliated with,
          endorsed by, or sponsored by Roblox Corporation. Roblox, Roblox
          Studio, and related marks belong to Roblox Corporation. See{" "}
          <a href="#sec-13">Section 13</a>.
        </p>
      </LegalSection>

      <LegalSection id="sec-2" num="2" title="Definitions">
        <ul>
          <li>
            <strong>Service</strong> — the {siteConfig.name} website, desktop
            application, Roblox Studio plugin, and related functionality.
          </li>
          <li>
            <strong>Account</strong> — the {siteConfig.name} account you create
            or authenticate through, used to access protected Service features.
          </li>
          <li>
            <strong>Input</strong> — prompts, instructions, code, files, or
            other content you submit to the Service.
          </li>
          <li>
            <strong>Output</strong> — code, scripts, plugin source, text, or
            other content generated by the Service from your Input.
          </li>
          <li>
            <strong>Desktop application</strong> — the local {siteConfig.name}
            software installed on your computer.
          </li>
          <li>
            <strong>Plugin</strong> — the {siteConfig.name} Roblox Studio
            plugin that connects the desktop application to Roblox Studio.
          </li>
          <li>
            <strong>AI provider</strong> — a third-party artificial intelligence
            model provider that may process inputs to generate Output.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="sec-3" num="3" title="Eligibility and age requirements">
        <p>
          You must be at least <strong>13 years old</strong> to use the
          Service.
        </p>
        <ul>
          <li>
            If you are under the age of digital consent in your&nbsp;country
            (which in the EU/EEA is generally between 13 and 16), a parent or
            legal guardian must read and agree to these Terms and our Privacy
            Policy on your behalf before you create an account or use the
            Service.
          </li>
          <li>
            We do not knowingly collect personal information from children
            under the age of 13. If we learn that we have collected personal
            information from someone under 13 without appropriate consent, we
            will delete it. See our Privacy Policy,{" "}
            <a href="/privacy#sec-30">Section 30</a>.
          </li>
          <li>
            You must not use the Service if you are barred from using it under
            applicable law.
          </li>
        </ul>
        <div className="legal-callout">
          Roblox and the Roblox community include many younger users. Bricky
          AI is a development tool, not a game or a toy. You are responsible for
          making sure that your use complies with these Terms and with Roblox
          Corporation&apos;s own Terms of Use, Community Standards, and
          Developer Terms.
        </div>
      </LegalSection>

      <LegalSection id="sec-4" num="4" title="Account creation">
        <p>
          Some features of the Service require an Account. You may create one
          using Google sign-in or an email address and password. When you create
          an Account you agree to provide accurate information and to keep it
          up to date.
        </p>
        <p>
          Accounts are personal. You may not share your login credentials with
          others, sell your Account, or create Accounts through automated means.
        </p>
      </LegalSection>

      <LegalSection id="sec-5" num="5" title="Google login / authentication">
        <p>
          When you choose &ldquo;Continue with Google&rdquo;, authentication is handled by
          Google through its OAuth service. Google provides us with information
          about your Google account that you agree to share — typically your
          email address and Google account identifier, and depending on the
          configuration, profile information.
        </p>
        <p>
          Your use of Google&apos;s services remains subject to Google&apos;s
          own terms and privacy policy. We do not receive or store your Google
          password.
        </p>
      </LegalSection>

      <LegalSection id="sec-6" num="6" title="Account security">
        <p>
          You are responsible for keeping your credentials confidential and for
          all activity that occurs under your Account. If you believe your
          Account has been compromised, change your password and contact us
          immediately.
        </p>
        <p>
          If you sign in with Google, you are responsible for the security of
          your Google account and for the access you grant to Bricky AI.
        </p>
      </LegalSection>

      <LegalSection id="sec-7" num="7" title="Bricky AI services">
        <p>
          Bricky AI provides tools that may help you:
        </p>
        <ul>
          <li>write Roblox Lua/Luau scripts and other Roblox code;</li>
          <li>generate, modify, and review Roblox code;</li>
          <li>
            interact with Roblox Studio through the Bricky AI Roblox Studio
            plugin;
          </li>
          <li>create Roblox plugins;</li>
          <li>assist with development workflows; and</li>
          <li>
            communicate with AI models to generate code and other development
            output.
          </li>
        </ul>
        <p>
          The Service may also interact with your local development environment
          through the desktop application where you explicitly enable those
          capabilities. The exact capabilities available to you may change as
          the Service evolves.
        </p>
      </LegalSection>

      <LegalSection id="sec-8" num="8" title="AI-generated code and outputs">
        <p>
          Bricky AI uses artificial intelligence to generate Output. AI is not
          deterministic like a compiler or a simple tool. Output is provided to
          help you develop more quickly; it is not a substitute for writing,
          reviewing, and testing your own code.
        </p>
        <p>
          AI-generated code may contain bugs, may be incomplete, may behave
          unexpectedly, or may fail to compile or run. It may also contain
          security or performance problems. You are responsible for testing
          generated code and for deciding whether it is suitable for your game,
          plugin, or project. Bricky AI does not guarantee that any generated
          code will work correctly.
        </p>
      </LegalSection>

      <LegalSection id="sec-9" num="9" title="User inputs, prompts and content">
        <p>
          You may submit Input to the Service, including prompts, instructions,
          code, files, and other content. You must have the rights to submit
          the Input you provide, and you must not submit Input that violates
          these Terms or any law.
        </p>
        <p>
          Do not submit anything you are not authorized to share. In
          particular, do not expose secrets, credentials, or personal data of
          others through the Service.
        </p>
      </LegalSection>

      <LegalSection id="sec-10" num="10" title="Ownership of user content">
        <p>
          You retain ownership of the content you own that you submit to the
          Service. We do not claim ownership of your Roblox projects, scripts,
          or original content.
        </p>
        <p>
          To the extent needed to provide the Service, you grant us a limited,
          non-exclusive, revocable licence to process, store, and transmit your
          Input so that we can operate the Service, generate Output, and comply
          with these Terms and applicable law.
        </p>
      </LegalSection>

      <LegalSection id="sec-11" num="11" title="Rights to generated outputs">
        <p>
          Subject to these Terms, you may use Output generated by the Service
          for your own development purposes, including in Roblox projects and
          plugins you create.
        </p>
        <p>
          However, AI-generated Output is not necessarily unique or
          copyrightable. Similar or identical Output may be generated for other
          users, and Output may be based on or resemble other material.
          Bricky AI does not guarantee that an Output is unique, copyrightable,
          or free from similarities to other generated Output or to existing
          works. You are responsible for reviewing Output and for ensuring that
          your use of it is lawful and does not infringe the rights of others.
        </p>
      </LegalSection>

      <LegalSection id="sec-12" num="12" title="AI limitations">
        <ul>
          <li>AI may misunderstand your instructions or intent.</li>
          <li>AI may produce plausible but incorrect code or explanations.</li>
          <li>AI may not be aware of the latest Roblox APIs or platform changes.</li>
          <li>AI may be inconsistent between sessions and between users.</li>
          <li>AI Output may at times be incomplete, generic, or require significant manual review.</li>
        </ul>
        <p>
          You should treat Output as a draft or suggestion, not as authoritative
          documentation or a specification.
        </p>
      </LegalSection>

      <LegalSection id="sec-13" num="13" title="Roblox / Roblox Studio disclaimer">
        <p>
          Bricky AI is an independent, third-party development tool. Bricky AI
          is not Roblox, and Roblox Corporation does not sponsor, endorse, or
          otherwise control Bricky AI unless a separate written relationship
          says otherwise.
        </p>
        <p>
          Roblox Studio is a third-party platform owned by Roblox Corporation.
          Your use of Roblox, Roblox Studio, or any Roblox service remains
          subject to Roblox&apos;s Terms of Use, Community Standards, Developer
          Terms, and any other applicable policies.
        </p>
        <p>
          Bricky AI does not guarantee that code, plugins, or games generated
          or modified with our tools comply with Roblox&apos;s policies. You are
          responsible for that compliance. None of these Terms create any
          partnership, agency, franchise, or employment relationship between you
          and Roblox Corporation, or between Bricky AI and Roblox Corporation.
        </p>
      </LegalSection>

      <LegalSection id="sec-14" num="14" title="Plugin creation">
        <p>
          Bricky AI can help you create and develop Roblox Studio plugins. When
          you create a plugin, you are responsible for how that plugin behaves,
          for following Roblox Developer Terms, and for any consequences of
          distributing or publishing it.
        </p>
      </LegalSection>

      <LegalSection id="sec-15" num="15" title="Desktop application capabilities">
        <p>
          The Bricky AI desktop application runs locally on your computer. Where
          you explicitly enable them, features of the desktop application may
          interact with your local environment, including your project files,
          plugin files, generated development files, and application-specific
          local data.
        </p>
        <div className="legal-callout">
          <strong>Local computer access.</strong> When you use the desktop
          application (and, where applicable, the Roblox Studio plugin), we
          encourage you to stay in control. Only provide access to the files,
          folders, plugins, and systems you actually want Bricky AI to work
          with. Bricky AI only interacts with what the application you install
          is actually permitted to access, and you decide what you ask it to
          do.
        </div>
      </LegalSection>

      <LegalSection id="sec-16" num="16" title="Local computer interaction">
        <p>
          Certain Bricky AI functionality may require the desktop application
          and/or the Roblox Studio plugin to interact with:
        </p>
        <ul>
          <li>Roblox Studio;</li>
          <li>local project files;</li>
          <li>plugin files;</li>
          <li>generated development files; and</li>
          <li>
            other resources that you explicitly make available to the
            application.
          </li>
        </ul>
        <p>
          You are responsible for reviewing what you ask Bricky AI to do and for
          making sure you do not give the application access to files or
          systems you do not want it to interact with. You should review the
          permissions and settings of the desktop application before enabling
          local features.
        </p>
      </LegalSection>

      <LegalSection id="sec-17" num="17" title="User responsibility for generated code">
        <p>
          You are responsible for all code, plugins, and Output that you use in
          your projects, including code generated with Bricky AI. Before
          publishing or shipping anything, you should:
        </p>
        <ul>
          <li>review the code for correctness and completeness;</li>
          <li>test it in the environments where it will run;</li>
          <li>check for security problems and vulnerabilities; and</li>
          <li>verify that it complies with applicable policies and laws.</li>
        </ul>
        <p>
          We are not liable for harm caused by code you wrote or published,
          even where that code drew on Output from the Service.
        </p>
      </LegalSection>

      <LegalSection id="sec-18" num="18" title="Acceptable use">
        <p>
          You may use the Service for lawful development purposes. You must not
          use the Service, or any Output or Input you receive from it, to:
        </p>
        <ul>
          <li>create or spread malware, ransomware, or destructive software;</li>
          <li>steal or harvest credentials or account information;</li>
          <li>phish or defraud other people;</li>
          <li>gain unauthorized access to systems or networks;</li>
          <li>carry out cyberattacks, DDoS attacks, or network attacks;</li>
          <li>
            build cheating systems intended to abuse or attack other users;
          </li>
          <li>
            build malicious exploits against Roblox or other platforms or
            services;
          </li>
          <li>send spam or engage in fraud or impersonation;</li>
          <li>violate the privacy of other people;</li>
          <li>infringe the intellectual property rights of others;</li>
          <li>engage in any illegal activity; or</li>
          <li>
            attempt to bypass security, authentication, subscription, or
            credit/usage restrictions, or to interfere with the Bricky AI
            API/backend.
          </li>
        </ul>
        <p>
          Legitimate security research and development is different from abuse.
          Us<strong>ing Bricky AI to write, generate, or review defensive
          security tooling for systems you own or are authorized to test is
          permitted</strong>. Acting without authorization, or helping others
          attack systems they do not own, is not.
        </p>
      </LegalSection>

      <LegalSection id="sec-19" num="19" title="Prohibited activities">
        <p>
          Without limiting Section 18, you must not:
        </p>
        <ul>
          <li>reverse engineer the Service for unauthorized purposes;</li>
          <li>probe, scan, or test the Service&apos;s infrastructure in a way that degrades it;</li>
          <li>reproduce, resell, or sublicense the Service or access to it without permission;</li>
          <li>use the Service to build a competing product by extracting prompts or model behaviour at scale; or</li>
          <li>interfere with other users&apos; use of the Service.</li>
        </ul>
      </LegalSection>

      <LegalSection id="sec-20" num="20" title="Malware / harmful code restrictions">
        <p>
          You must not use Bricky AI to write, generate, distribute, or deploy
          malicious or harmful code, including malware, ransomware, spyware,
          keyloggers, credential stealers, or code intended to damage, disable,
          or take over computer systems without authorization.
        </p>
        <p>
          You must not use Bricky AI to generate phishing content, fake
          websites, or other deceptive material aimed at stealing information.
        </p>
      </LegalSection>

      <LegalSection id="sec-21" num="21" title="Abuse, automation and attacks">
        <p>
          You must not attempt to overload, spam, or attack the Service, its
          infrastructure, or its providers. This includes automated scraping,
          credential stuffing, denial-of-service activity, and attempts to
          bypass rate limits. We may throttle or block activity we reasonably
          believe is abusive.
        </p>
      </LegalSection>

      <LegalSection id="sec-22" num="22" title="Intellectual property">
        <p>
          The Service, including its software, design, branding, and
          documentation, is the property of Bricky AI and its licensors or
          suppliers. Your limited right to use the Service does not give you
          any ownership of it.
        </p>
        <p>
          &ldquo;Bricky AI&rdquo; and related names and logos are our branding. Roblox,
          Roblox Studio, and related Roblox names and marks are trademarks of
          Roblox Corporation. Nothing in these Terms grants you any right to
          use Roblox&apos;s marks or our marks except as needed to use the
          Service for its intended purpose.
        </p>
      </LegalSection>

      <LegalSection id="sec-23" num="23" title="Copyright complaints">
        <p>
          If you believe in good faith that material on or generated through
          the Service infringes your copyright, contact us using the details in{" "}
          <a href="#sec-45">Section 45</a> with enough information for us to
          evaluate your claim (a description of the work, the location of the
          allegedly infringing material, and your contact details). We will
          review reports consistent with applicable law and treat repeat
          infringement appropriately where the law requires.
        </p>
      </LegalSection>

      <LegalSection id="sec-24" num="24" title="Third-party services">
<p>
          The Service relies on and integrates with third-party services and
          platforms, including Roblox Studio, authentication providers, Vercel
          (the hosting platform that serves this website), and other hosting
          and infrastructure providers. These third parties have their own
          terms and privacy policies, which may change without notice to us. We
          are not responsible for those third-party services.
        </p>
      </LegalSection>

      <LegalSection id="sec-25" num="25" title="Third-party AI providers">
        <p>
          To generate Output, the Service may send your Input, relevant code and
          context, and other information necessary to generate a response to
          third-party AI providers. Those providers process data on their own
          terms and privacy policies. The type and amount of information sent
          depends on the feature you use and the information you submit. See our
          Privacy Policy, Sections{" "}
          <a href="/privacy#sec-20">20</a> and <a href="/privacy#sec-21">21</a>,
          for more detail.
        </p>
      </LegalSection>

      <LegalSection id="sec-26" num="26" title="Subscriptions">
        <p>
          Some features of the Service may be available on a paid subscription
          basis. Subscription plans and their features, including any usage
          allowances or credit limits, are described at the point of purchase
          and may change from time to time.
        </p>
        <p>
          A subscription gives you access to the features included in the plan
          you selected for the applicable subscription period. Unless stated
          otherwise, subscriptions renew automatically until cancelled.
        </p>
      </LegalSection>

      <LegalSection id="sec-27" num="27" title="Credits / usage limits">
        <p>
          Bricky AI plans may include credits or defined usage allowances.
          Credits may be subject to plan-specific rules, such as expiry,
          caps, or limits on how they can be used. Usage may be limited to
          protect the Service and to keep pricing predictable. We may adjust
          credits, allowances, or limits with reasonable notice where permitted
          by applicable law.
        </p>
      </LegalSection>

      <LegalSection id="sec-28" num="28" title="Payments and billing">
        <p>
          If you purchase a subscription, pricing and billing terms are shown at
          checkout. Payments are processed by third-party payment providers —
          Bricky AI does not store your payment card number. By providing
          payment details you agree to the applicable payment provider&apos;s
          terms.
        </p>
        <p>
          Prices may change for future billing periods with reasonable notice.
          Where required by law, taxes are charged separately.
        </p>
      </LegalSection>

      <LegalSection id="sec-29" num="29" title="Refund policy">
        <p>
          Refunds are handled in accordance with applicable law and any terms
          presented at the time of purchase. Where you have statutory consumer
          rights (including, in the EU/EEA, rights applicable to distance
          contracts and to the supply of digital content), those rights are not
          limited by these Terms.
        </p>
        <p>
          For any billing question, contact us using the details in{" "}
          <a href="#sec-45">Section 45</a>.
        </p>
      </LegalSection>

      <LegalSection id="sec-30" num="30" title="Service availability">
        <p>
          We aim to keep the Service available, but we do not guarantee that it
          will be uninterrupted, error-free, or always available. The Service
          may be temporarily unavailable for maintenance, upgrades, or reasons
          outside our reasonable control.
        </p>
      </LegalSection>

      <LegalSection id="sec-31" num="31" title="Maintenance and changes">
        <p>
          We may update, modify, or discontinue features of the Service from
          time to time to improve it, respond to changes in third-party
          services (including Roblox and AI providers), or comply with the law.
          Where a change materially affects you and applicable law requires
          notice, we will notify you reasonably in advance.
        </p>
      </LegalSection>

      <LegalSection id="sec-32" num="32" title="Account suspension and termination">
        <p>
          You may stop using the Service at any time. We may suspend or
          terminate your access to the Service if you breach these Terms, if
          required by law, or if continued service to you poses a security or
          operational risk.
        </p>
        <p>
          If we suspend or terminate your account, we will make reasonable
          efforts to let you know and to allow you to retrieve content you own,
          except where doing so would violate the law or harm the Service or
          others. This section does not limit any rights available to consumers
          under mandatory local law.
        </p>
      </LegalSection>

      <LegalSection id="sec-33" num="33" title="User-requested account deletion">
        <p>
          You can request deletion of your account and associated personal data
          from your account menu at any time. The request is verified securely
          and your account is deleted.
        </p>
        <div className="legal-callout">
          Where legally required, limited records (for example, transactional
          or accounting records) may be retained after account deletion for the
          periods required by law. Backups and logs may also take time to cycle
          out. We do not claim that every record is instantly and permanently
          erased.
        </div>
        <p>
          See our Privacy Policy, <a href="/privacy#sec-31">Section 31</a>, for
          more detail on account and data deletion.
        </p>
      </LegalSection>

      <LegalSection id="sec-34" num="34" title="Privacy Policy reference">
        <p>
          Our{" "}
          <a href="/privacy">
            Privacy Policy
          </a>{" "}
          describes what information we collect and process, why, how long it is
          kept, and the rights you have. By using the Service you acknowledge
          that you have read it.
        </p>
      </LegalSection>

      <LegalSection id="sec-35" num="35" title="Data security disclaimer">
        <p>
          We use reasonable administrative, technical, and organisational
          measures to protect data we process. No method of transmission or
          storage is completely secure. You also play a role: keep your
          credentials private, and do not submit secrets or sensitive data you
          are not comfortable sharing with the Service and its providers.
        </p>
      </LegalSection>

      <LegalSection id="sec-36" num="36" title="AI accuracy disclaimer">
        <p>
          The Service generates content using artificial intelligence, which
          can be wrong, incomplete, or misleading. AI Output may not always be
          unique, and AI may misunderstand your instructions. You should
          independently verify important Output. The Service is provided
          &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without warranties
          of merchantability, fitness for a particular purpose, accuracy, or
          non-infringement, except where such disclaimers are not permitted by
          mandatory law.
        </p>
      </LegalSection>

      <LegalSection id="sec-37" num="37" title="No professional advice">
        <p>
          Bricky AI generates code, not legal, financial, or other professional
          advice. Output should not be relied upon as professional advice. If
          you need professional advice, consult a qualified professional.
        </p>
      </LegalSection>

      <LegalSection id="sec-38" num="38" title="Limitation of liability">
        <p>
          To the maximum extent permitted by applicable law, Bricky AI and its
          operator shall not be liable for indirect, incidental, special,
          consequential, or punitive damages, or for loss of profits, data, or
          goodwill, arising out of or relating to your use of the Service.
        </p>
        <p>
          To the maximum extent permitted by law, our total aggregate liability
          arising out of or relating to the Service is limited to the greater
          of (a) the amount you paid us in the twelve months before the claim
          arose, or (b) a token amount permitted by applicable law. Nothing in
          these Terms limits liability that cannot be limited by applicable
          law, including liability for gross negligence, fraud, or willful
          misconduct, or any liability under mandatory consumer protection law.
        </p>
      </LegalSection>

      <LegalSection id="sec-39" num="39" title="Indemnification">
        <p>
          To the extent permitted by applicable law, you agree to indemnify and
          hold harmless Bricky AI, its operator, and their respective
          officers, employees, and agents from and against claims, damages,
          liabilities, and reasonable costs (including legal fees) arising from
          (a) your Input, (b) your use of the Service, (c) your misuse of
          Output, or (d) your breach of these Terms or applicable law.
        </p>
      </LegalSection>

      <LegalSection id="sec-40" num="40" title="Governing law and disputes">
        <p>
          These Terms are governed by the laws of {companyInfo.operatorCountry},
          without regard to conflict-of-laws rules, except where mandatory
          consumer protection law gives you additional rights.
        </p>
        <p>
          We will try to resolve disputes amicably and directly first. Disputes
          not resolved amicably will be subject to the exclusive jurisdiction of
          the competent courts of {companyInfo.operatorCountry}, unless
          mandatory local law requires otherwise. Nothing in this section
          limits your right to bring proceedings before the courts of your
          country of residence, or to use alternative dispute resolution where
          available in the EU.
        </p>
      </LegalSection>

      <LegalSection id="sec-41" num="41" title="International users">
        <p>
          Bricky AI is available to users in multiple countries. Where you use
          the Service from outside {companyInfo.operatorCountry}, you are
          responsible for complying with local laws applicable to you. Mandatory
          consumer protections in your country of residence apply to you
          regardless of anything in these Terms.
        </p>
      </LegalSection>

      <LegalSection id="sec-42" num="42" title="Changes to the Terms">
        <p>
          We may update these Terms from time to time. When we make material
          changes, we will post the updated version and update the
          &ldquo;last updated&rdquo; date. Where applicable law requires, we
          will provide reasonable notice. Your continued use of the Service
          after changes take effect means you accept the updated Terms.
        </p>
      </LegalSection>

      <LegalSection id="sec-43" num="43" title="Severability">
        <p>
          If any provision of these Terms is found to be invalid or
          unenforceable, that provision will be read as modified to the minimum
          extent necessary, or removed, and the remaining provisions will stay
          in full force and effect.
        </p>
      </LegalSection>

      <LegalSection id="sec-44" num="44" title="Entire agreement">
        <p>
          These Terms, together with the Privacy Policy and any other terms
          expressly incorporated by reference, constitute the entire agreement
          between you and Bricky AI regarding the Service. If you have a signed
          written agreement with Bricky AI that covers the same subject matter,
          that agreement prevails to the extent of any conflict.
        </p>
      </LegalSection>

      <LegalSection id="sec-45" num="45" title="Contact information">
        <p>For questions about these Terms, contact us at:</p>
        <CompanyInfo className="mt-2" />
      </LegalSection>
    </LegalLayout>
  );
}