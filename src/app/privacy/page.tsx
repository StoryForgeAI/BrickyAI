import type { Metadata } from "next";
import LegalLayout from "@/components/legal/LegalLayout";
import LegalSection from "@/components/legal/LegalSection";
import CompanyInfo from "@/components/legal/CompanyInfo";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy Policy — Bricky AI",
  description:
    "How Bricky AI collects, uses, and protects your information: Google sign-in, cookies and consent, AI features, data that stays local, your rights, and more.",
};

const TOC = [
  { id: "sec-1", num: "1", label: "Introduction" },
  { id: "sec-2", num: "2", label: "Definitions" },
  { id: "sec-3", num: "3", label: "Scope of this policy" },
  { id: "sec-4", num: "4", label: "Data controller and contact" },
  { id: "sec-5", num: "5", label: "Information you provide" },
  { id: "sec-6", num: "6", label: "Email address and login" },
  { id: "sec-7", num: "7", label: "Google account information" },
  { id: "sec-8", num: "8", label: "Verification / anonymized identifier" },
  { id: "sec-9", num: "9", label: "User ID" },
  { id: "sec-10", num: "10", label: "Subscription and credits" },
  { id: "sec-11", num: "11", label: "Technical and diagnostic data" },
  { id: "sec-12", num: "12", label: "Payment information" },
  { id: "sec-13", num: "13", label: "Purposes of processing" },
  { id: "sec-14", num: "14", label: "Lawful bases for processing" },
  { id: "sec-15", num: "15", label: "Cookies and similar technology" },
  { id: "sec-16", num: "16", label: "Local storage" },
  { id: "sec-17", num: "17", label: "Data that stays on your computer" },
  { id: "sec-18", num: "18", label: "Data in the Roblox Studio plugin" },
  { id: "sec-19", num: "19", label: "Data sent to Bricky AI" },
  { id: "sec-20", num: "20", label: "Sharing with AI providers" },
  { id: "sec-21", num: "21", label: "Sharing with Supabase / infrastructure" },
  { id: "sec-22", num: "22", label: "Other third-party providers" },
  { id: "sec-23", num: "23", label: "International data transfers" },
  { id: "sec-24", num: "24", label: "Data retention" },
  { id: "sec-25", num: "25", label: "Security" },
  { id: "sec-26", num: "26", label: "Your rights (overview)" },
  { id: "sec-27", num: "27", label: "Right to access and portability" },
  { id: "sec-28", num: "28", label: "Right to rectification" },
  { id: "sec-29", num: "29", label: "Right to erasure" },
  { id: "sec-30", num: "30", label: "Children and minors" },
  { id: "sec-31", num: "31", label: "Account deletion in practice" },
  { id: "sec-32", num: "32", label: "US residents (California)" },
  { id: "sec-33", num: "33", label: "Changes to this policy" },
  { id: "sec-34", num: "34", label: "How to contact us" },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Privacy Policy"
      lastUpdated="September 6, 2026"
      intro={
        <>
          This Privacy Policy explains what information{" "}
          {siteConfig.name} collects and processes, why we process it, how long
          we keep it, when it is shared with trusted providers, and the rights
          and choices you have. It applies whenever you use the Service,
          including the website, the desktop application, and the Roblox Studio
          plugin.
        </>
      }
      toc={TOC}
      companion={{
        href: "/terms",
        label: "Terms of Service",
        description:
          "The Terms of Service you agree to when you use Bricky AI. You can read the",
      }}
    >
      <LegalSection id="sec-1" num="1" title="Introduction">
        <p>
          {siteConfig.name} is an independent, AI-powered development tool for
          Roblox Studio plugins and Roblox code. Because parts of the Service
          require an account, we process some personal information. This policy
          is written so you know exactly what we process and why — we do not
          run advertising networks, we do not sell your data, and we keep
          account data to a minimum.
        </p>
        <p>
          {siteConfig.name} is not owned by, affiliated with, or endorsed by
          Roblox Corporation. When you use Roblox or Roblox Studio, Roblox
          Corporation collects and processes your data under its own policies.
        </p>
      </LegalSection>

      <LegalSection id="sec-2" num="2" title="Definitions">
        <ul>
          <li>
            <strong>Service</strong> — the {siteConfig.name} website, desktop
            application, Roblox Studio plugin, and related functionality.
          </li>
          <li>
            <strong>Personal information</strong> — information that relates to
            an identified or identifiable individual.
          </li>
          <li>
            <strong>AI provider</strong> — a third-party artificial intelligence
            model provider used to generate Output.
          </li>
          <li>
            <strong>Supabase</strong> — the backend infrastructure provider we
            use for authentication (account sign-in) and related account data
            storage.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="sec-3" num="3" title="Scope of this policy">
        <p>
          This policy covers the collection and processing of personal
          information by {siteConfig.name} through the Service. It does not
          cover third-party services you use alongside or through Bricky AI,
          including Roblox Corporation&apos;s platforms and the AI providers,
          each of which has its own privacy practices.
        </p>
      </LegalSection>

      <LegalSection id="sec-4" num="4" title="Data controller and contact">
        <p>
          The data controller responsible for the processing described in this
          policy is the operator of {siteConfig.name}. For questions about this
          policy or your data, contact:
        </p>
        <CompanyInfo className="mt-2" />
      </LegalSection>

      <LegalSection id="sec-5" num="5" title="Information you provide directly">
        <p>
          Bricky AI uses <strong>Google sign-in only</strong> — there is no
          email-and-password registration and we never receive a password from
          you. When you create an account, sign in, or contact support, the
          information we receive about you comes from your Google account and
          from how you use the Service (such as messages to support and the
          inputs you submit to AI features).
        </p>
      </LegalSection>

      <LegalSection id="sec-6" num="6" title="Email address and login">
        <p>
          Your <strong>email address</strong> is the primary identifier of your
          Bricky AI account. Sign-in is available exclusively through Google
          OAuth; there is no email-and-password registration and no password to
          reset. When you sign in with Google, Google shares the email address
          associated with your Google account with us and we store it as your
          profile email.
        </p>
        <p>
          Your email address is used to identify your account and to send you
          important service communications. We do not send you marketing emails
          without your consent.
        </p>
      </LegalSection>

      <LegalSection id="sec-7" num="7" title="Google account information">
        <p>
          Because &ldquo;Continue with Google&rdquo; is the{" "}
          <strong>only</strong> way to sign in, you always authenticate with
          Google, a separate data controller. Google provides us with the
          information you agreed to share — typically your email address and a
          Google account identifier (and, depending on configuration, basic
          profile information such as your name and profile picture). We store
          this as your profile in your Bricky AI account.
        </p>
        <p>
          We do not receive or store your Google password. Google&apos;s own
          privacy policy applies to the information Google processes when you
          sign in.
        </p>
      </LegalSection>

      <LegalSection id="sec-8" num="8" title="Verification / anonymized identifier">
        <p>
          To operate accounts securely, some identifiers involved in sign-in
          are technical and are not meaningfully tied to your identity outside
          the Service. For example, Supabase generates an encrypted,
          account-bound identifier and records the verification status provided
          by Google. Because accounts are created through Google, they arrive
          already verified by Google — we do not separately require an email
          confirmation step. These details are used to keep accounts secure and
          to prevent abuse.
        </p>
      </LegalSection>

      <LegalSection id="sec-9" num="9" title="User ID">
        <p>
          Each account is assigned a unique internal <strong>user ID</strong>.
          This is the value we use to associate your account with your session,
          your download entitlements, and any subscription or credits, without
          referring to your name or email for routine operations.
        </p>
      </LegalSection>

      <LegalSection id="sec-10" num="10" title="Subscription and credits">
        <p>
          If you have a subscription or credits, we process the data needed to
          operate them: subscription status, billing period, plan, usage
          against your allowances, and purchase history. This data is linked to
          your user ID and is used to provide the features you&nbsp;paid for.
        </p>
      </LegalSection>

      <LegalSection id="sec-11" num="11" title="Technical and diagnostic data">
        <p>
          Like most web services, our hosting providers automatically record
          basic technical data when the Service is used: approximate network
          information (IP address), device and browser information, and
          timestamps. We use this to provide, secure, and troubleshoot the
          Service and to defend it against abuse or attacks.
        </p>
      </LegalSection>

      <LegalSection id="sec-12" num="12" title="Payment information">
        <p>
          Bricky AI does not store your payment card number. Payments are
          processed by third-party payment providers; they process payment
          data under their own terms and privacy policies. Bricky AI receives
          only the confirmation details needed to record your purchase.
        </p>
      </LegalSection>

      <LegalSection id="sec-13" num="13" title="Purposes of processing">
        <p>We process personal information for the following purposes:</p>
        <ul>
          <li>providing, operating, and improving the Service;</li>
          <li>creating and authenticating accounts and protecting them;</li>
          <li>
            processing subscriptions, credits, and entitlements (including
            download entitlements);
          </li>
          <li>
            powering AI features that generate code and other Output (see{" "}
            <a href="#sec-20">Section 20</a>);
          </li>
          <li>
            responding to support requests and providing account services
            (including account deletion);
          </li>
          <li>ensuring safety, security, and compliance with the law; and</li>
          <li>
            communicating important service information with you.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="sec-14" num="14" title="Lawful bases for processing">
        <p>
          Depending on where you live, applicable data protection law (in the
          EU/EEA and UK, the GDPR) requires a lawful basis for processing. We
          rely on the following bases:
        </p>
        <ul>
          <li>
            <strong>Contract</strong> — processing needed to provide the
            Service under our Terms.
          </li>
          <li>
            <strong>Legitimate interests</strong> — securing the Service,
            preventing abuse, and improving it (balanced against your rights).
          </li>
          <li>
            <strong>Consent</strong> — where we ask for permission for a
            specific processing activity, you can withdraw it at any time.
          </li>
          <li>
            <strong>Legal obligation</strong> — processing required to comply
            with law (for example, accounting records or responding to legal
            process).
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="sec-15" num="15" title="Cookies and similar technology">
        <p>
          The Service relies on <strong>essential session technology</strong>{" "}
          to keep you signed in and to make the website function — for example,
          the small storage Supabase uses to hold your authentication session.
          This is technically necessary and is not optional.
        </p>
        <p>
          On your first visit, the site presents a cookie banner where you can
          accept all, reject non-essential storage, or open Cookie Settings and
          choose per category. We use two categories:
        </p>
        <ul>
          <li>
            <strong>Necessary</strong> — always active; keeps you signed in,
            remembers your consent choice, and protects the Service.
          </li>
          <li>
            <strong>Preferences</strong> — optional and off by default; used to
            remember harmless choices you make on the site.
          </li>
        </ul>
        <p>
          Your choice is stored on your device and can be changed at any time
          via <strong>Cookie Settings</strong> in the site footer (or in the
          sign-in window).
        </p>
        <div className="legal-callout">
          We do not use advertising cookies, tracking cookies, analytics
          cookies, fingerprinting, or third-party ad networks, and we do not
          sell or share your information for advertising.
        </div>
      </LegalSection>

      <LegalSection id="sec-16" num="16" title="Local storage">
        <p>
          Your browser and the desktop application use local storage to keep
          you signed in (Supabase&apos;s authentication session), to record your
          cookie-consent choice, and to remember harmless preferences. This data
          stays on your device and is not sent to us unless a feature you
          actively use requires it.
        </p>
      </LegalSection>

      <LegalSection id="sec-17" num="17" title="Data that stays on your computer">
        <p>
          The {siteConfig.name} desktop application runs locally. Your project
          files, plugin source, and local development files are <strong>not
          uploaded to us automatically</strong>. They are read only when you
          explicitly ask Bricky AI to work with them, and only the parts needed
          for the task you request are sent to the AI provider that generates a
          response (see <a href="#sec-20">Section 20</a>).
        </p>
        <p>
          The connection between the desktop application and Roblox Studio runs
          locally on your machine via the Roblox Studio plugin. It does not
          route through our servers.
        </p>
      </LegalSection>

      <LegalSection id="sec-18" num="18" title="Data in the Roblox Studio plugin">
        <p>
          The {siteConfig.name} Roblox Studio plugin communicates locally with
          the desktop application to send selections, scripts, and context you
          choose to work on. It does not upload your projects to us on its own,
          and we do not continuously monitor your Roblox Studio activity.
        </p>
      </LegalSection>

      <LegalSection id="sec-19" num="19" title="Data sent to Bricky AI">
        <p>
          When you use AI features, the inputs you submit are transmitted to us
          and to the AI provider to generate a response. This includes your
          prompts, the code or context you attach, and your account identifier
          where needed for authentication. We keep these transmissions to the
          minimum necessary to fulfill the request.
        </p>
      </LegalSection>

      <LegalSection id="sec-20" num="20" title="Sharing with AI providers">
        <p>
          To generate Output, we send your prompt (along with the relevant code
          or context you attach) to third-party AI providers. Those providers
          process your inputs under their own terms and privacy policies, and
          may store or use them in line with those policies. Before using the
          AI features, consider what you include in prompts — do not submit
          secrets, credentials, or third-party personal data you are not
          authorized to share.
        </p>
        <p>
          The AI provider may or may not use your inputs to improve models,
          depending on the provider&apos;s own defaults and your configuration.
          We do not train models on your Input ourselves.
        </p>
      </LegalSection>

      <LegalSection id="sec-21" num="21" title="Sharing with Supabase / infrastructure">
        <p>
          Account authentication and related account data are handled by{" "}
          <strong>Supabase</strong>, our backend infrastructure provider. This
          means the email address Google shares with us, your account
          identifier, verification status, and session data reside within
          Supabase&apos;s infrastructure, which is protected by its security
          practices. A record of the account (including the Google-provided
          email) is stored in Supabase&apos;s account database. The website
          itself is served on <strong>Vercel</strong>, which processes the
          technical data described in <a href="#sec-11">Section 11</a> (such
          as IP addresses and request metadata) to deliver and protect the
          site. The rest of the Service uses hosting and infrastructure
          providers located in multiple regions.
        </p>
      </LegalSection>

      <LegalSection id="sec-22" num="22" title="Other third-party providers">
        <p>
          We use a small number of service providers to operate the Service
          (for example, hosting, error monitoring, transactional email, and
          payment processing). Each provider receives only the data needed to
          perform its function and is contractually required to protect it.
        </p>
      </LegalSection>

      <LegalSection id="sec-23" num="23" title="International data transfers">
        <p>
          We and our providers operate in multiple countries, and your
          information may be processed outside your country of residence. Where
          we transfer personal information out of the EU/EEA or UK, we rely on
          appropriate safeguards (such as the European Commission&apos;s
          adequacy decisions or standard contractual clauses). You can ask for
          details of the safeguards in place by contacting us.
        </p>
      </LegalSection>

      <LegalSection id="sec-24" num="24" title="Data retention">
        <p>
          We keep personal information only for as long as needed for the
          purposes described in this policy or as required by law. Account data
          (including your email address) is kept while your account exists and
          is deleted when you delete your account, subject to the limited
          exceptions in <a href="#sec-31">Section 31</a>. Logs and technical
          data are retained briefly for security and troubleshooting.
        </p>
      </LegalSection>

      <LegalSection id="sec-25" num="25" title="Security">
        <p>
          We use reasonable administrative, technical, and organisational
          measures to protect personal information, including encrypted
          connections and access controls. No system is perfectly secure, and
          you share responsibility by keeping your credentials private.
        </p>
      </LegalSection>

      <LegalSection id="sec-26" num="26" title="Your rights (overview)">
        <p>
          Depending on your location, you may have rights over your personal
          information, such as the rights to access, correct, delete, or
          port your data, and to object to or restrict certain processing.
          These rights apply under the GDPR for users in the EU/EEA and UK, and
          under similar laws elsewhere (for example, <a href="#sec-32">Section
          32</a> for users in the US).
        </p>
        <p>
          To exercise any of these rights, contact us using the details in{" "}
          <a href="#sec-34">Section 34</a>. Where you have a complaint, you may
          also have the right to lodge it with your local data protection
          authority.
        </p>
      </LegalSection>

      <LegalSection id="sec-27" num="27" title="Right to access and portability">
        <p>
          You can ask for a copy of the personal information we hold about you,
          and — where technically feasible and permitted by law — for that
          information in a structured, machine-readable format to transfer to
          another provider. In many cases you can also access your own account
          information directly from your account.
        </p>
      </LegalSection>

      <LegalSection id="sec-28" num="28" title="Right to rectification">
        <p>
          You can ask us to correct personal information that is inaccurate or
          incomplete (for example, your email address). Account details linked
          to your sign-in method can usually be corrected from your account or
          by raising a support request.
        </p>
      </LegalSection>

      <LegalSection id="sec-29" num="29" title="Right to erasure">
        <p>
          You can ask us to delete personal information we hold about you,
          subject to legal requirements to keep certain records. You do not
          need to ask in order to delete your account — see{" "}
          <a href="#sec-31">Section 31</a>.
        </p>
      </LegalSection>

      <LegalSection id="sec-30" num="30" title="Children and minors">
        <p>
          The Service requires users to be at least <strong>13 years old</strong>{" "}
          (consistent with our Terms of Service, <a href="/terms#sec-3">Section
          3</a>). We do not knowingly collect personal information from children
          under 13.
        </p>
        <ul>
          <li>
            Users under the age of digital consent in their country (in the
            EU/EEA, generally between 13 and 16) need a parent or legal
            guardian&apos;s permission to use the Service.
          </li>
          <li>
            If you believe a child under 13 (or an underage child without
            consent) has provided us with personal information, contact us and
            we will delete it as soon as possible.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="sec-31" num="31" title="Account deletion in practice">
        <p>
          You can delete your account (and the personal information associated
          with it) at any time from your account menu. The request is verified
          securely and the deletion is processed automatically against
          Supabase, our account infrastructure provider.
        </p>
        <div className="legal-callout">
          Where the law requires it, limited records may be kept after account
          deletion — for example, accounting or tax records that must be
          retained for a fixed period, or logs that only cycle out over time.
          These situations are exceptional and limited to what the law, or
          technical reality, demands.
        </div>
      </LegalSection>

      <LegalSection id="sec-32" num="32" title="US residents (California)">
        <p>
          If you are a resident of California (or another US state with a
          comparable privacy law), you have additional rights. We{" "}
          <strong>do not sell</strong> your personal information and{" "}
          <strong>do not share</strong> it for cross-context behavioral
          advertising (targeted advertising). We do not use advertising
          cookies.
        </p>
        <p>
          You may request to know what personal information we have collected,
          request deletion of your personal information, and request
          non-discrimination for exercising your rights. Use the contact
          details in <a href="#sec-34">Section 34</a>.
        </p>
      </LegalSection>

      <LegalSection id="sec-33" num="33" title="Changes to this policy">
        <p>
          We may update this policy from time to time and will post the updated
          version here with a new &ldquo;last updated&rdquo; date. Where a
          change is material, we will provide reasonable notice before it takes
          effect. Your continued use of the Service after changes take effect
          means you accept the updated policy.
        </p>
      </LegalSection>

      <LegalSection id="sec-34" num="34" title="How to contact us">
        <p>For questions, requests, or complaints about this policy or your data:</p>
        <CompanyInfo className="mt-2" />
      </LegalSection>
    </LegalLayout>
  );
}