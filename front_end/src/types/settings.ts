export interface UserProfile {
  name: string;
  jobTitle: string;
  phone: string;
  email: string;
  whatsapp?: string;
  location?: string;
}

export interface CompanyProfile {
  companyName: string;
  website: string;
  address: string;
  tagline: string;
  legalName?: string;
  supportEmail?: string;
  logoUrl?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export type EmailBodyTemplate = 'classic' | 'modern' | 'minimal' | 'colorful' | 'elegant';

export interface EmailSettings {
  tone: 'professional' | 'friendly';
  length: 'short' | 'detailed';
  ctaStyle: 'schedule_call' | 'request_confirmation' | 'share_brochure' | 'send_proposal';
  includeCompliance: boolean;
  complianceText: string;
  signatureTemplate: string;
  autoAppendSignature: boolean;
  emailBodyTemplate: EmailBodyTemplate;
  systemPrompt: string;
}

export interface AppSettings {
  userProfile: UserProfile;
  companyProfile: CompanyProfile;
  services: ServiceItem[];
  emailSettings: EmailSettings;
}

export const defaultSettings: AppSettings = {
  userProfile: {
    name: 'John Doe',
    jobTitle: 'Business Development Manager',
    phone: '+1 (555) 123-4567',
    email: 'john.doe@company.com',
    whatsapp: '+1 (555) 123-4567',
    location: 'New York, NY',
  },
  companyProfile: {
    companyName: 'TechVentures Inc.',
    website: 'www.techventures.com',
    address: '123 Innovation Drive, Suite 400, New York, NY 10001',
    tagline: 'Transforming Ideas into Digital Reality',
    legalName: 'TechVentures International Inc.',
    supportEmail: 'support@techventures.com',
    logoUrl: '/Tekisho-Logo.jpg',
  },
  services: [
    { id: '1', name: 'Custom Software Development', description: 'End-to-end software solutions', enabled: true },
    { id: '2', name: 'Cloud Migration Services', description: 'Seamless cloud transformation', enabled: true },
    { id: '3', name: 'AI & Machine Learning', description: 'Intelligent automation solutions', enabled: false },
    { id: '4', name: 'Digital Transformation', description: 'Business process optimization', enabled: false },
  ],
  emailSettings: {
    tone: 'professional',
    length: 'detailed',
    ctaStyle: 'schedule_call',
    includeCompliance: false,
    complianceText: 'This email is intended for the addressed recipient only. If you have received this in error, please delete it.',
    signatureTemplate: `<div style="font-family: Arial, sans-serif; margin-top: 20px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
  <p style="margin: 0; font-weight: bold; color: #1a365d;">{{name}}</p>
  <p style="margin: 2px 0; color: #4a5568;">{{jobTitle}}</p>
  <p style="margin: 2px 0; color: #4a5568;">{{companyName}}</p>
  <p style="margin: 8px 0 2px 0; color: #718096; font-size: 13px;">📞 {{phone}} | ✉️ {{email}}</p>
  <p style="margin: 2px 0; color: #718096; font-size: 13px;">🌐 {{website}}</p>
</div>`,
    autoAppendSignature: true,
    emailBodyTemplate: 'classic',
    systemPrompt: `You are a professional email drafting assistant. Generate follow-up emails based on meeting summaries.

Guidelines:
- Tone: {{tone}} (professional = formal business language, friendly = warm but professional)
- Length: {{length}} (short = 150-200 words, detailed = 300-400 words)
- Always include a clear subject line that reflects the meeting topic
- Structure: Greeting, meeting recap, key decisions/action items, next steps, CTA, closing
- CTA Style: {{ctaStyle}}
- If compliance is enabled, include the compliance text at the end

The email should:
1. Reference specific topics discussed in the meeting
2. Highlight key decisions and action items
3. Propose clear next steps
4. Include a compelling call-to-action
5. Maintain a {{tone}} tone throughout`,
  },
};
