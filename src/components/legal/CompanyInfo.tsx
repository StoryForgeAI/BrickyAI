import { companyInfo, hasCompleteCompanyInfo } from "@/lib/company";

/**
 * Renders the official operator information. Unknown values are shown as the
 * clearly-marked placeholder tokens from `src/lib/company.ts` so the owner can
 * fill them in without hunting through the design.
 */
export default function CompanyInfo({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          Operated by {companyInfo.operatorName}
        </h3>
        {!hasCompleteCompanyInfo && (
          <span
            title="Some company details below are placeholders that the operator needs to complete."
            className="rounded-full border border-[var(--accent-border)] bg-[var(--accent-dim)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--accent)]"
          >
            Pending
          </span>
        )}
      </div>

      <address className="mt-3 space-y-1.5 text-xs leading-relaxed text-[var(--text-secondary)] not-italic">
        <p>Rapidline KKFT — {companyInfo.operatorCountry}</p>
        <p>
          Registered address: <span className="font-mono text-[11px]">{companyInfo.legalAddress}</span>
        </p>
        <p>
          Company registration:{" "}
          <span className="font-mono text-[11px]">{companyInfo.registrationNumber}</span>
        </p>
        <p>
          Tax / VAT: <span className="font-mono text-[11px]">{companyInfo.taxNumber}</span>
        </p>
        <p>
          Registry details:{" "}
          <span className="font-mono text-[11px]">{companyInfo.registryDetails}</span>
        </p>
        <p>
          Legal / privacy contact:{" "}
          <span className="font-mono text-[11px]">{companyInfo.contactEmail}</span>
        </p>
      </address>

      {!hasCompleteCompanyInfo && (
        <p className="mt-3 text-[11px] leading-relaxed text-[var(--text-muted)]">
          The bracketed items above are placeholders. They will be replaced with
          the exact official details by the operator before these documents are
          used to enter into agreements.
        </p>
      )}
    </div>
  );
}