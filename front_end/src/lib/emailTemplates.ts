import { MeetingSummary, EmailInclusions } from '@/types/meeting';
import { AppSettings } from '@/types/settings';
import { renderSignatureTemplate } from './utils';

export type EmailBodyTemplate = 'classic' | 'modern' | 'minimal' | 'colorful' | 'elegant';

interface TemplateParams {
  meeting: MeetingSummary;
  settings: AppSettings;
  inclusions: EmailInclusions;
  greeting: string;
  intro: string;
  ctaMessage: string;
  closing: string;
}

export const generateEmailBodyWithTemplate = (
  template: EmailBodyTemplate,
  params: TemplateParams
): string => {
  const { meeting, settings, inclusions, greeting, intro, ctaMessage, closing } = params;
  const { userProfile, companyProfile, services, emailSettings } = settings;
  const selectedServices = services.filter((s) => inclusions.selectedServices.includes(s.id));

  switch (template) {
    case 'classic':
      return generateClassicTemplate(params);
    case 'modern':
      return generateModernTemplate(params);
    case 'minimal':
      return generateMinimalTemplate(params);
    case 'colorful':
      return generateColorfulTemplate(params);
    case 'elegant':
      return generateElegantTemplate(params);
    default:
      return generateClassicTemplate(params);
  }
};

// Classic Template - Traditional business email style
const generateClassicTemplate = (params: TemplateParams): string => {
  const { meeting, settings, inclusions, greeting, intro, ctaMessage, closing } = params;
  const { companyProfile, services, emailSettings } = settings;
  const selectedServices = services.filter((s) => inclusions.selectedServices.includes(s.id));

  let htmlBody = `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto;">`;
  
  // Logo header
  if (companyProfile.logoUrl) {
    const logoUrl = getLogoUrl(companyProfile.logoUrl, companyProfile.website);
    htmlBody += `<div style="background-color: #ffffff; border-bottom: 2px solid #e0e0e0; padding: 20px 0; margin-bottom: 24px; text-align: center;">`;
    htmlBody += `<img src="${logoUrl}" alt="${companyProfile.companyName}" style="max-width: 200px; height: auto; display: block; margin: 0 auto;" />`;
    htmlBody += `</div>`;
  }
  
  htmlBody += `<p style="margin: 0 0 16px 0;">${greeting}</p>`;
  htmlBody += `<p style="margin: 0 0 16px 0;">${intro}</p>`;

  if (inclusions.meetingSummary) {
    htmlBody += `<p style="margin: 16px 0 8px 0;"><strong style="font-size: 16px; color: #1a365d;">Meeting Summary:</strong></p>`;
    htmlBody += `<p style="margin: 0 0 16px 0;">${meeting.summary.replace(/\n/g, '<br>')}</p>`;
  }

  if (inclusions.actionItems && meeting.actionItems.length > 0) {
    htmlBody += `<p style="margin: 16px 0 8px 0;"><strong style="font-size: 16px; color: #1a365d;">Action Items & Next Steps:</strong></p>`;
    htmlBody += `<ol style="margin: 0 0 16px 0; padding-left: 24px;">`;
    meeting.actionItems.forEach((item) => {
      htmlBody += `<li style="margin: 4px 0;">${item}</li>`;
    });
    htmlBody += `</ol>`;
  }

  if (meeting.keyDecisions.length > 0) {
    htmlBody += `<p style="margin: 16px 0 8px 0;"><strong style="font-size: 16px; color: #1a365d;">Key Decisions:</strong></p>`;
    htmlBody += `<ul style="margin: 0 0 16px 0; padding-left: 24px;">`;
    meeting.keyDecisions.forEach((decision) => {
      htmlBody += `<li style="margin: 4px 0;">${decision}</li>`;
    });
    htmlBody += `</ul>`;
  }

  if (inclusions.companyProfile) {
    htmlBody += `<p style="margin: 16px 0 8px 0;"><strong style="font-size: 16px; color: #1a365d;">About ${companyProfile.companyName}:</strong></p>`;
    htmlBody += `<p style="margin: 0 0 8px 0;">${companyProfile.tagline}</p>`;
    htmlBody += `<p style="margin: 0 0 16px 0;">Website: <a href="${companyProfile.website.startsWith('http') ? companyProfile.website : 'https://' + companyProfile.website}" style="color: #2563eb; text-decoration: none;">${companyProfile.website}</a></p>`;
  }

  if (selectedServices.length > 0) {
    htmlBody += `<p style="margin: 16px 0 8px 0;"><strong style="font-size: 16px; color: #1a365d;">Our Services:</strong></p>`;
    htmlBody += `<ul style="margin: 0 0 16px 0; padding-left: 24px;">`;
    selectedServices.forEach((service) => {
      htmlBody += `<li style="margin: 4px 0;"><strong>${service.name}:</strong> ${service.description}</li>`;
    });
    htmlBody += `</ul>`;
  }

  htmlBody += `<p style="margin: 16px 0;">${ctaMessage}</p>`;
  htmlBody += `<p style="margin: 16px 0 8px 0;">${closing}</p>`;

  if (emailSettings.includeCompliance && emailSettings.complianceText) {
    htmlBody += `<hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;" />`;
    htmlBody += `<p style="margin: 0; font-size: 12px; color: #718096;">${emailSettings.complianceText}</p>`;
  }

  if (emailSettings.autoAppendSignature && emailSettings.signatureTemplate) {
    const signatureHtml = renderSignatureTemplate(
      emailSettings.signatureTemplate,
      settings.userProfile,
      companyProfile
    );
    htmlBody += signatureHtml;
  }

  htmlBody += `</div>`;
  return htmlBody;
};

// Modern Template - Clean, contemporary design with subtle colors
const generateModernTemplate = (params: TemplateParams): string => {
  const { meeting, settings, inclusions, greeting, intro, ctaMessage, closing } = params;
  const { companyProfile, services, emailSettings } = settings;
  const selectedServices = services.filter((s) => inclusions.selectedServices.includes(s.id));

  let htmlBody = `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.7; color: #2d3748; max-width: 650px; margin: 0 auto; background: #f7fafc;">`;
  
  // Modern header with gradient
  if (companyProfile.logoUrl) {
    const logoUrl = getLogoUrl(companyProfile.logoUrl, companyProfile.website);
    htmlBody += `<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; margin-bottom: 30px;">`;
    htmlBody += `<img src="${logoUrl}" alt="${companyProfile.companyName}" style="max-width: 180px; height: auto; display: block; margin: 0 auto; filter: brightness(0) invert(1);" />`;
    htmlBody += `</div>`;
  }
  
  htmlBody += `<div style="background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">`;
  htmlBody += `<p style="margin: 0 0 20px 0; font-size: 16px;">${greeting}</p>`;
  htmlBody += `<p style="margin: 0 0 24px 0; color: #4a5568;">${intro}</p>`;

  if (inclusions.meetingSummary) {
    htmlBody += `<div style="background: #edf2f7; padding: 16px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 4px;">`;
    htmlBody += `<p style="margin: 0 0 8px 0; font-weight: 600; color: #2d3748; font-size: 15px;">Meeting Summary</p>`;
    htmlBody += `<p style="margin: 0; color: #4a5568;">${meeting.summary.replace(/\n/g, '<br>')}</p>`;
    htmlBody += `</div>`;
  }

  if (inclusions.actionItems && meeting.actionItems.length > 0) {
    htmlBody += `<div style="margin: 24px 0;">`;
    htmlBody += `<p style="margin: 0 0 12px 0; font-weight: 600; color: #2d3748; font-size: 15px;">Action Items & Next Steps</p>`;
    htmlBody += `<ol style="margin: 0; padding-left: 20px; color: #4a5568;">`;
    meeting.actionItems.forEach((item) => {
      htmlBody += `<li style="margin: 6px 0;">${item}</li>`;
    });
    htmlBody += `</ol></div>`;
  }

  if (meeting.keyDecisions.length > 0) {
    htmlBody += `<div style="margin: 24px 0;">`;
    htmlBody += `<p style="margin: 0 0 12px 0; font-weight: 600; color: #2d3748; font-size: 15px;">Key Decisions</p>`;
    htmlBody += `<ul style="margin: 0; padding-left: 20px; color: #4a5568;">`;
    meeting.keyDecisions.forEach((decision) => {
      htmlBody += `<li style="margin: 6px 0;">${decision}</li>`;
    });
    htmlBody += `</ul></div>`;
  }

  htmlBody += `<div style="background: #f0fff4; padding: 16px; border-radius: 6px; margin: 24px 0; border-left: 4px solid #48bb78;">`;
  htmlBody += `<p style="margin: 0; color: #2d3748; font-weight: 500;">${ctaMessage}</p>`;
  htmlBody += `</div>`;

  htmlBody += `<p style="margin: 24px 0 8px 0; color: #2d3748;">${closing}</p>`;
  htmlBody += `</div>`;

  if (emailSettings.autoAppendSignature && emailSettings.signatureTemplate) {
    const signatureHtml = renderSignatureTemplate(
      emailSettings.signatureTemplate,
      settings.userProfile,
      companyProfile
    );
    htmlBody += `<div style="padding: 20px 30px;">${signatureHtml}</div>`;
  }

  htmlBody += `</div>`;
  return htmlBody;
};

// Minimal Template - Simple, clean, lots of white space
const generateMinimalTemplate = (params: TemplateParams): string => {
  const { meeting, settings, inclusions, greeting, intro, ctaMessage, closing } = params;
  const { companyProfile, emailSettings } = settings;

  let htmlBody = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.8; color: #1a202c; max-width: 580px; margin: 0 auto; padding: 40px 20px;">`;
  
  if (companyProfile.logoUrl) {
    const logoUrl = getLogoUrl(companyProfile.logoUrl, companyProfile.website);
    htmlBody += `<div style="text-align: center; margin-bottom: 40px;">`;
    htmlBody += `<img src="${logoUrl}" alt="${companyProfile.companyName}" style="max-width: 150px; height: auto;" />`;
    htmlBody += `</div>`;
  }
  
  htmlBody += `<p style="margin: 0 0 24px 0; font-size: 16px;">${greeting}</p>`;
  htmlBody += `<p style="margin: 0 0 32px 0; color: #4a5568;">${intro}</p>`;

  if (inclusions.meetingSummary) {
    htmlBody += `<p style="margin: 32px 0 12px 0; font-size: 14px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: #718096;">Meeting Summary</p>`;
    htmlBody += `<p style="margin: 0 0 32px 0; color: #2d3748;">${meeting.summary.replace(/\n/g, '<br>')}</p>`;
  }

  if (inclusions.actionItems && meeting.actionItems.length > 0) {
    htmlBody += `<p style="margin: 32px 0 12px 0; font-size: 14px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: #718096;">Action Items</p>`;
    meeting.actionItems.forEach((item, i) => {
      htmlBody += `<p style="margin: 8px 0; color: #2d3748;">${i + 1}. ${item}</p>`;
    });
    htmlBody += `<div style="margin-bottom: 32px;"></div>`;
  }

  htmlBody += `<p style="margin: 32px 0; color: #2d3748;">${ctaMessage}</p>`;
  htmlBody += `<p style="margin: 32px 0 0 0; color: #1a202c;">${closing}</p>`;

  if (emailSettings.autoAppendSignature && emailSettings.signatureTemplate) {
    const signatureHtml = renderSignatureTemplate(
      emailSettings.signatureTemplate,
      settings.userProfile,
      companyProfile
    );
    htmlBody += `<div style="margin-top: 40px; padding-top: 32px; border-top: 1px solid #e2e8f0;">${signatureHtml}</div>`;
  }

  htmlBody += `</div>`;
  return htmlBody;
};

// Colorful Template - Vibrant colors and modern design
const generateColorfulTemplate = (params: TemplateParams): string => {
  const { meeting, settings, inclusions, greeting, intro, ctaMessage, closing } = params;
  const { companyProfile, services, emailSettings } = settings;
  const selectedServices = services.filter((s) => inclusions.selectedServices.includes(s.id));

  let htmlBody = `<div style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">`;
  
  // Colorful header
  if (companyProfile.logoUrl) {
    const logoUrl = getLogoUrl(companyProfile.logoUrl, companyProfile.website);
    htmlBody += `<div style="background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4); padding: 25px; text-align: center; margin-bottom: 25px; border-radius: 8px 8px 0 0;">`;
    htmlBody += `<img src="${logoUrl}" alt="${companyProfile.companyName}" style="max-width: 180px; height: auto; background: white; padding: 10px; border-radius: 6px;" />`;
    htmlBody += `</div>`;
  }
  
  htmlBody += `<div style="background: #fff; padding: 25px; border-radius: 0 0 8px 8px;">`;
  htmlBody += `<p style="margin: 0 0 18px 0; font-size: 17px; color: #2c3e50;">${greeting}</p>`;
  htmlBody += `<p style="margin: 0 0 22px 0; color: #34495e;">${intro}</p>`;

  if (inclusions.meetingSummary) {
    htmlBody += `<div style="background: #fff5f5; border-left: 5px solid #ff6b6b; padding: 15px; margin: 20px 0; border-radius: 4px;">`;
    htmlBody += `<p style="margin: 0 0 8px 0; font-weight: 700; color: #c92a2a; font-size: 16px;">📋 Meeting Summary</p>`;
    htmlBody += `<p style="margin: 0; color: #495057;">${meeting.summary.replace(/\n/g, '<br>')}</p>`;
    htmlBody += `</div>`;
  }

  if (inclusions.actionItems && meeting.actionItems.length > 0) {
    htmlBody += `<div style="background: #e7f5ff; border-left: 5px solid #4ecdc4; padding: 15px; margin: 20px 0; border-radius: 4px;">`;
    htmlBody += `<p style="margin: 0 0 10px 0; font-weight: 700; color: #087f5b; font-size: 16px;">✅ Action Items</p>`;
    htmlBody += `<ol style="margin: 0; padding-left: 20px; color: #495057;">`;
    meeting.actionItems.forEach((item) => {
      htmlBody += `<li style="margin: 5px 0;">${item}</li>`;
    });
    htmlBody += `</ol></div>`;
  }

  if (meeting.keyDecisions.length > 0) {
    htmlBody += `<div style="background: #fff3cd; border-left: 5px solid #ffd43b; padding: 15px; margin: 20px 0; border-radius: 4px;">`;
    htmlBody += `<p style="margin: 0 0 10px 0; font-weight: 700; color: #856404; font-size: 16px;">🎯 Key Decisions</p>`;
    htmlBody += `<ul style="margin: 0; padding-left: 20px; color: #495057;">`;
    meeting.keyDecisions.forEach((decision) => {
      htmlBody += `<li style="margin: 5px 0;">${decision}</li>`;
    });
    htmlBody += `</ul></div>`;
  }

  htmlBody += `<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">`;
  htmlBody += `<p style="margin: 0; font-weight: 600; font-size: 16px;">${ctaMessage}</p>`;
  htmlBody += `</div>`;

  htmlBody += `<p style="margin: 20px 0 8px 0; color: #2c3e50;">${closing}</p>`;
  htmlBody += `</div>`;

  if (emailSettings.autoAppendSignature && emailSettings.signatureTemplate) {
    const signatureHtml = renderSignatureTemplate(
      emailSettings.signatureTemplate,
      settings.userProfile,
      companyProfile
    );
    htmlBody += `<div style="padding: 20px 25px; background: #f8f9fa; border-radius: 0 0 8px 8px;">${signatureHtml}</div>`;
  }

  htmlBody += `</div>`;
  return htmlBody;
};

// Elegant Template - Sophisticated, premium look
const generateElegantTemplate = (params: TemplateParams): string => {
  const { meeting, settings, inclusions, greeting, intro, ctaMessage, closing } = params;
  const { companyProfile, emailSettings } = settings;

  let htmlBody = `<div style="font-family: 'Georgia', 'Times New Roman', serif; line-height: 1.8; color: #1a1a1a; max-width: 620px; margin: 0 auto; background: #fafafa;">`;
  
  // Elegant header
  if (companyProfile.logoUrl) {
    const logoUrl = getLogoUrl(companyProfile.logoUrl, companyProfile.website);
    htmlBody += `<div style="background: #1a1a1a; padding: 35px 30px; text-align: center; margin-bottom: 35px;">`;
    htmlBody += `<img src="${logoUrl}" alt="${companyProfile.companyName}" style="max-width: 200px; height: auto; filter: brightness(0) invert(1);" />`;
    htmlBody += `</div>`;
  }
  
  htmlBody += `<div style="background: #ffffff; padding: 40px 35px; border: 1px solid #e5e5e5;">`;
  htmlBody += `<p style="margin: 0 0 22px 0; font-size: 17px; color: #1a1a1a; font-style: italic;">${greeting}</p>`;
  htmlBody += `<p style="margin: 0 0 28px 0; color: #4a4a4a; text-align: justify;">${intro}</p>`;

  if (inclusions.meetingSummary) {
    htmlBody += `<div style="border-top: 2px solid #d4af37; padding-top: 20px; margin: 28px 0;">`;
    htmlBody += `<p style="margin: 0 0 12px 0; font-weight: 600; color: #1a1a1a; font-size: 16px; letter-spacing: 1px; text-transform: uppercase;">Meeting Summary</p>`;
    htmlBody += `<p style="margin: 0; color: #4a4a4a; text-align: justify;">${meeting.summary.replace(/\n/g, '<br>')}</p>`;
    htmlBody += `</div>`;
  }

  if (inclusions.actionItems && meeting.actionItems.length > 0) {
    htmlBody += `<div style="border-top: 1px solid #e5e5e5; padding-top: 20px; margin: 28px 0;">`;
    htmlBody += `<p style="margin: 0 0 15px 0; font-weight: 600; color: #1a1a1a; font-size: 15px; letter-spacing: 0.5px;">Action Items & Next Steps</p>`;
    htmlBody += `<ol style="margin: 0; padding-left: 25px; color: #4a4a4a;">`;
    meeting.actionItems.forEach((item) => {
      htmlBody += `<li style="margin: 8px 0; text-align: justify;">${item}</li>`;
    });
    htmlBody += `</ol></div>`;
  }

  htmlBody += `<div style="background: #f9f9f9; padding: 20px; margin: 28px 0; border-left: 4px solid #d4af37;">`;
  htmlBody += `<p style="margin: 0; color: #1a1a1a; font-style: italic; text-align: center;">${ctaMessage}</p>`;
  htmlBody += `</div>`;

  htmlBody += `<p style="margin: 28px 0 8px 0; color: #1a1a1a;">${closing}</p>`;
  htmlBody += `</div>`;

  if (emailSettings.autoAppendSignature && emailSettings.signatureTemplate) {
    const signatureHtml = renderSignatureTemplate(
      emailSettings.signatureTemplate,
      settings.userProfile,
      companyProfile
    );
    htmlBody += `<div style="padding: 30px 35px; background: #fafafa; border-top: 1px solid #e5e5e5;">${signatureHtml}</div>`;
  }

  htmlBody += `</div>`;
  return htmlBody;
};

// Helper function to get logo URL
const getLogoUrl = (logoUrl: string, website: string): string => {
  if (logoUrl.startsWith('http')) return logoUrl;
  
  const baseUrl = website.startsWith('http') ? website : `https://${website}`;
  if (logoUrl.startsWith('/')) {
    return `${baseUrl}${logoUrl}`;
  }
  return `${baseUrl}/${logoUrl}`;
};

