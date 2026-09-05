/**
 * Official legal / operating company information for Bricky AI.
 *
 * ---------------------------------------------------------------------------
 *  IMPORTANT — OWNER INPUT REQUIRED
 * ---------------------------------------------------------------------------
 *  Only the company name ("Rapidline KKFT") is known to this project.
 *  Every other field below is a clearly-marked placeholder. Replace the
 *  bracket tokens with the exact official details before going live.
 *
 *  Do NOT invent registration numbers, VAT numbers, addresses, emails or
 *  registry information. If a value is unknown, keep the placeholder.
 * ---------------------------------------------------------------------------
 */

export const companyInfo = {
  /** Service operator legal name. */
  operatorName: "Rapidline KKFT",

  /** Country of establishment / registration (used in legal text). */
  operatorCountry: "Hungary",

  /** Official registered business address. */
  legalAddress: "[COMPANY LEGAL ADDRESS]",

  /** Company / business registration number. */
  registrationNumber: "[COMPANY REGISTRATION NUMBER]",

  /** Tax / VAT number (if registered for VAT). */
  taxNumber: "[COMPANY TAX NUMBER]",

  /** Official registry details (court/registry name, etc.). */
  registryDetails: "[COMPANY REGISTRY DETAILS]",

  /** Official contact address for legal / privacy correspondence. */
  contactEmail: "[LEGAL CONTACT EMAIL]",

  /** True once every official field above has been filled in. */
  infoComplete: false,
} as const;

export const hasCompleteCompanyInfo = companyInfo.infoComplete;

/**
 * Placeholder tokens rendered in the UI. Keeping them visually obvious makes it
 * trivial to (a) notice what still needs to be filled in and (b) grep-replace
 * them once the official data is available.
 */
export function companyPlaceholder(label: string): string {
  return `[${label}]`;
}