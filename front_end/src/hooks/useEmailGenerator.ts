import { useState, useCallback } from 'react';
import { MeetingSummary, EmailDraft, EmailInclusions } from '@/types/meeting';
import { AppSettings } from '@/types/settings';
import { renderSignatureTemplate } from '@/lib/utils';
import { generateEmailBodyWithTemplate } from '@/lib/emailTemplates';
import { toast } from 'sonner';

const generateEmailLocally = (
  meeting: MeetingSummary,
  settings: AppSettings,
  inclusions: EmailInclusions,
  type: 'subject' | 'body' | 'all'
) => {
  const { userProfile, companyProfile, services, emailSettings } = settings;
  const selectedServices = services.filter((s) => inclusions.selectedServices.includes(s.id));

  // Generate subject based on meeting summary and mode
  const generateSubject = () => {
    const isVirtualMeeting = meeting.mode === 'Virtual';
    const emailType = isVirtualMeeting ? 'Invitation' : 'Follow-up';
    
    // Extract key topic from mom or summary
    let topic = meeting.companyName || 'Project Discussion';
    
    if (meeting.mom) {
      // Extract first meaningful phrase from mom
      const momWords = meeting.mom.split(/[,.]/).filter(w => w.trim().length > 0);
      if (momWords.length > 0) {
        const firstPhrase = momWords[0].trim();
        topic = firstPhrase.length > 30 ? firstPhrase.substring(0, 30) + '...' : firstPhrase;
      }
    }
    
    return `${emailType}: ${topic} | ${companyProfile.companyName}`;
  };

  // Generate body based on settings and inclusions (returns HTML)
  const generateBody = () => {
    const isVirtualMeeting = meeting.mode === 'Virtual';
    const greeting = emailSettings.tone === 'professional' 
      ? `Dear ${meeting.recipientName},` 
      : `Hi ${meeting.recipientName},`;

    let intro = '';
    if (isVirtualMeeting) {
      // For invitation emails
      intro = emailSettings.tone === 'professional'
        ? `You are invited to a meeting with ${companyProfile.companyName}.`
        : `You're invited to join our meeting!`;
    } else {
      // For follow-up emails
      intro = emailSettings.tone === 'professional'
        ? `Thank you for taking the time to meet with me on ${meeting.meetingDate} at ${meeting.meetingTime}. It was a pleasure discussing with you.`
        : `Great catching up with you on ${meeting.meetingDate}! Really enjoyed our conversation.`;
    }

    const ctaMessages = {
      schedule_call: "Would you be available for a follow-up call this week? Let me know your preferred time.",
      request_confirmation: "Could you please confirm receipt of this email and let me know your thoughts?",
      share_brochure: "I'd be happy to share our detailed brochure. Would you like me to send it over?",
      send_proposal: "I'll prepare a detailed proposal based on our discussion. Expect it within the next few days."
    };

    const closing = emailSettings.tone === 'professional' 
      ? 'Best regards,' 
      : 'Looking forward to hearing from you!';

    // Build meeting details section for invitation emails
    let meetingDetailsSection = '';
    if (isVirtualMeeting && meeting.scheduledDate && meeting.scheduledTime) {
      meetingDetailsSection = `
Meeting Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date: ${meeting.scheduledDate}
Time: ${meeting.scheduledTime}
Platform: ${meeting.platform || 'TBD'}
Meeting Link: ${meeting.meetingLink || 'To be confirmed'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;
    }

    // For invitation emails, exclude meeting summary
    const emailInclusions = isVirtualMeeting 
      ? { ...inclusions, meetingSummary: false }
      : inclusions;

    // Generate HTML body
    const htmlBody = generateEmailBodyWithTemplate(
      emailSettings.emailBodyTemplate,
      {
        meeting,
        settings,
        inclusions: emailInclusions,
        greeting,
        intro,
        ctaMessage: ctaMessages[emailSettings.ctaStyle],
        closing,
      }
    );

    // Convert HTML to plain text for display in textarea
    const plainTextBody = (greeting + '\n\n' + intro + '\n\n' + meetingDetailsSection + htmlBody)
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<p[^>]*>/gi, '')
      .replace(/<div[^>]*>/gi, '')
      .replace(/<strong[^>]*>/gi, '')
      .replace(/<\/strong>/gi, '')
      .replace(/<em[^>]*>/gi, '')
      .replace(/<\/em>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();

    return plainTextBody;
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
