import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserProfile, CompanyProfile } from "@/types/settings";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Renders the signature template by replacing variables with actual values
 */
export function renderSignatureTemplate(
  template: string,
  userProfile: UserProfile,
  companyProfile: CompanyProfile
): string {
  let html = template;
  html = html.replace(/{{name}}/g, userProfile.name || '');
  html = html.replace(/{{jobTitle}}/g, userProfile.jobTitle || '');
  html = html.replace(/{{phone}}/g, userProfile.phone || '');
  html = html.replace(/{{email}}/g, userProfile.email || '');
  html = html.replace(/{{companyName}}/g, companyProfile.companyName || '');
  html = html.replace(/{{website}}/g, companyProfile.website || '');
  return html;
}
