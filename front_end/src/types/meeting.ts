export interface MeetingSummary {
  id: string;
  recipientName: string;
  recipientEmail: string;
  additionalEmails?: string[];
  meetingDate: string;
  meetingTime: string;
  summary: string;
  actionItems: string[];
  keyDecisions: string[];
  mode?: 'Virtual' | 'In-Person';
  mom?: string; // Minutes of Meeting
  // For Invitation emails
  platform?: string; // Zoom, Teams, etc.
  scheduledDate?: string;
  scheduledTime?: string;
  meetingLink?: string;
  channelSent?: string;
  companyName?: string;
}

export interface EmailAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string; // base64 data URL
}

export interface EmailDraft {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
  inclusions: EmailInclusions;
  selfieAttached: boolean;
  selfieUrl?: string;
  attachments: EmailAttachment[];
}

export interface EmailInclusions {
  meetingSummary: boolean;
  actionItems: boolean;
  userProfile: boolean;
  companyProfile: boolean;
  selectedServices: string[];
}

export const sampleMeetingSummary: MeetingSummary = {
  id: '1',
  recipientName: 'Sarah Johnson',
  recipientEmail: 'sarah.johnson@clientcorp.com',
  additionalEmails: ['team@clientcorp.com', 'mike.wilson@clientcorp.com'],
  meetingDate: '2024-12-05',
  meetingTime: '2:00 PM EST',
  summary: 'The conversation primarily focused on personal updates, including work, fitness routines, and cooking activities. No specific decisions or action items were discussed. The overall tone was casual and friendly, indicating a positive rapport between the speakers.',
  actionItems: [
    'Follow up on project timeline discussion',
    'Share workout routine recommendations',
    'Exchange favorite recipes',
  ],
  keyDecisions: [
    'Agreed to maintain regular check-ins',
    'Decided to explore collaboration opportunities',
  ],
  mode: 'Virtual',
  mom: 'Discussed project scope, timeline, and deliverables. Client expressed interest in additional features and requested a proposal within 2 weeks.',
  platform: 'Zoom',
  scheduledDate: '2025-12-20',
  scheduledTime: '10:30:00',
  meetingLink: 'https://zoom.us/j/123456789',
  channelSent: 'Email',
  companyName: 'Tech Solutions Inc',
};
