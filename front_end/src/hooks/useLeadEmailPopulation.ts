import { useCallback } from 'react';
import { Lead, Meeting } from '@/services/leadService';
import { EmailDraft } from '@/types/meeting';

export const useLeadEmailPopulation = () => {
  /**
   * Populate email fields from a selected lead
   */
  const populateFromLead = useCallback(
    (lead: Lead, currentDraft: EmailDraft): Partial<EmailDraft> => {
      return {
        to: lead.contact_emails?.[0] || '',
        cc: lead.contact_emails?.[1] ? lead.contact_emails[1] : '',
      };
    },
    []
  );

  /**
   * Populate email fields from a selected meeting
   */
  const populateFromMeeting = useCallback(
    (meeting: Meeting, currentDraft: EmailDraft): Partial<EmailDraft> => {
      const meetingDate = meeting.scheduled_date || 'recent';
      return {
        to: meeting.email,
        cc: meeting.recipients?.[1] || '',
        subject: `Follow-up: ${meeting.name}`,
        body: `
<p>Hi ${meeting.name.split(' ')[0]},</p>

<p>Thank you for taking the time to meet with me on ${meetingDate}. I enjoyed our discussion about your needs and the potential solutions we discussed.</p>

<p><strong>Key Points from Our Meeting:</strong></p>
<ul>
  <li>${meeting.mom || 'Meeting summary'}</li>
</ul>

<p>As discussed, here are the next steps:</p>
<ol>
  <li>Review the proposal</li>
  <li>Schedule a follow-up call</li>
  <li>Prepare implementation timeline</li>
</ol>

<p>Please feel free to reach out if you have any questions or need additional information. I'm looking forward to working with you.</p>

<p>Best regards,<br/>
Your Sales Team</p>
        `.trim(),
      };
    },
    []
  );

  /**
   * Auto-fill email from lead info (combine name, email, company)
   */
  const createLeadSummary = useCallback((lead: Lead): string => {
    return `
      <div style="background-color: #f3f4f6; padding: 12px; border-radius: 8px; margin: 16px 0;">
        <p><strong>${lead.first_name} ${lead.last_name}</strong></p>
        <p>${lead.company_name}</p>
        ${lead.job_title ? `<p><em>${lead.job_title}</em></p>` : ''}
        ${
          lead.contact_emails
            ? `<p>${lead.contact_emails[0]}${lead.contact_phones ? ` | ${lead.contact_phones[0]}` : ''}</p>`
            : ''
        }
      </div>
    `;
  }, []);

  return {
    populateFromLead,
    populateFromMeeting,
    createLeadSummary,
  };
};
