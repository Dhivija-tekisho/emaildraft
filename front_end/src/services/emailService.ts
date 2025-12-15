import { API_BASE_URL, API_ENDPOINTS } from "@/config/api";

export interface EmailAttachment {
  name: string;
  type: string;
  data: string; // base64 data URL
}

export interface SendEmailRequest {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  text?: string;
  html?: string;
  from_email?: string;
  from_name?: string;
  attachments?: EmailAttachment[];
}

export interface SendEmailResponse {
  status: string;
  response?: unknown;
}

export interface GmailComposeRequest {
  to?: string;
  cc?: string;
  bcc?: string;
  subject?: string;
  body?: string; // HTML body
  attachments?: EmailAttachment[];
}

export interface GmailComposeResponse {
  url: string;
}

export const emailService = {
  async sendEmail(payload: SendEmailRequest): Promise<SendEmailResponse> {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.email.send}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let detail = res.statusText;
      try {
        const data = await res.json();
        detail = data.detail || data.message || detail;
      } catch (e) {
        // ignore parse errors
      }
      throw new Error(detail || "Failed to send email");
    }

    return res.json();
  },

  async getGmailComposeUrl(payload: GmailComposeRequest): Promise<GmailComposeResponse> {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.email.gmailCompose}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let detail = res.statusText;
      try {
        const data = await res.json();
        detail = data.detail || data.message || detail;
      } catch (e) {
        // ignore parse errors
      }
      throw new Error(detail || "Failed to generate Gmail compose URL");
    }

    return res.json();
  },
};

