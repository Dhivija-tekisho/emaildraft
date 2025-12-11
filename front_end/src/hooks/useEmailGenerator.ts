import { useState, useCallback } from 'react';
import { MeetingSummary, EmailDraft, EmailInclusions } from '@/types/meeting';
import { AppSettings } from '@/types/settings';
import { toast } from 'sonner';

const generateEmailLocally = (
  meeting: MeetingSummary,
  settings: AppSettings,
  inclusions: EmailInclusions,
  type: 'subject' | 'body' | 'all'
) => {
  const { userProfile, companyProfile, services, emailSettings } = settings;
  const selectedServices = services.filter((s) => inclusions.selectedServices.includes(s.id));

  // Generate subject based on meeting summary
  const generateSubject = () => {
    const summaryWords = meeting.summary.split(' ').slice(0, 5).join(' ');
    return `Follow-up: ${summaryWords}... | ${companyProfile.companyName}`;
  };

  // Generate body based on settings and inclusions
  const generateBody = () => {
    const greeting = emailSettings.tone === 'professional' 
      ? `Dear ${meeting.recipientName},` 
      : `Hi ${meeting.recipientName},`;

    const intro = emailSettings.tone === 'professional'
      ? `Thank you for taking the time to meet with me on ${meeting.meetingDate} at ${meeting.meetingTime}. It was a pleasure discussing with you.`
      : `Great catching up with you on ${meeting.meetingDate}! Really enjoyed our conversation.`;

    let body = `${greeting}\n\n${intro}\n\n`;

    if (inclusions.meetingSummary) {
      body += `**Meeting Summary:**\n${meeting.summary}\n\n`;
    }

    if (inclusions.actionItems && meeting.actionItems.length > 0) {
      body += `**Action Items & Next Steps:**\n`;
      meeting.actionItems.forEach((item, i) => {
        body += `${i + 1}. ${item}\n`;
      });
      body += '\n';
    }

    if (meeting.keyDecisions.length > 0) {
      body += `**Key Decisions:**\n`;
      meeting.keyDecisions.forEach((decision, i) => {
        body += `• ${decision}\n`;
      });
      body += '\n';
    }

    if (inclusions.companyProfile) {
      body += `**About ${companyProfile.companyName}:**\n`;
      body += `${companyProfile.tagline}\n`;
      body += `Website: ${companyProfile.website}\n\n`;
    }

    if (selectedServices.length > 0) {
      body += `**Our Services:**\n`;
      selectedServices.forEach((service) => {
        body += `• ${service.name}: ${service.description}\n`;
      });
      body += '\n';
    }

    // CTA
    const ctaMessages = {
      schedule_call: "Would you be available for a follow-up call this week? Let me know your preferred time.",
      request_confirmation: "Could you please confirm receipt of this email and let me know your thoughts?",
      share_brochure: "I'd be happy to share our detailed brochure. Would you like me to send it over?",
      send_proposal: "I'll prepare a detailed proposal based on our discussion. Expect it within the next few days."
    };
    body += `${ctaMessages[emailSettings.ctaStyle]}\n\n`;

    // Closing
    body += emailSettings.tone === 'professional' 
      ? 'Best regards,' 
      : 'Looking forward to hearing from you!';

    if (inclusions.userProfile) {
      body += `\n\n${userProfile.name}\n${userProfile.jobTitle}\n${companyProfile.companyName}\n📞 ${userProfile.phone} | ✉️ ${userProfile.email}`;
      if (companyProfile.website) {
        body += `\n🌐 ${companyProfile.website}`;
      }
    }

    if (emailSettings.includeCompliance && emailSettings.complianceText) {
      body += `\n\n---\n${emailSettings.complianceText}`;
    }

    return body;
  };

  if (type === 'subject') return { subject: generateSubject() };
  if (type === 'body') return { body: generateBody() };
  return { subject: generateSubject(), body: generateBody() };
};

export const useEmailGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateEmail = useCallback(
    async (
      meeting: MeetingSummary,
      settings: AppSettings,
      inclusions: EmailInclusions,
      type: 'subject' | 'body' | 'all' = 'all'
    ): Promise<Partial<EmailDraft>> => {
      setIsGenerating(true);
      
      try {
        // Simulate AI generation delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        const result = generateEmailLocally(meeting, settings, inclusions, type);
        toast.success(type === 'all' ? 'Email generated successfully' : `${type.charAt(0).toUpperCase() + type.slice(1)} regenerated`);
        return result;
      } catch (error) {
        console.error('Email generation error:', error);
        toast.error('Failed to generate email. Please try again.');
        return {};
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  return { generateEmail, isGenerating };
};
