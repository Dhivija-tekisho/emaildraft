import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';

export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  email?: string;
  location?: string;
  // Legacy fields for backward compatibility
  tenant_id?: string;
  company_name?: string;
  job_title?: string;
  contact_emails?: string[];
  contact_phones?: string[];
  intake_status?: string;
}

export interface Meeting {
  id: string;
  lead_id: string;
  name: string;
  company_name?: string;
  email: string;
  contact?: string;
  status?: string;
  scheduled_date?: string;
  scheduled_time?: string;
  meeting_link?: string;
  mom?: string;
}

class LeadService {
  /**
   * Fetch all leads from Supabase users_login table
   */
  async getAllLeads(tenantId: string = 'tenant-001'): Promise<Lead[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/leads`);
      if (!response.ok) {
        throw new Error(`Failed to fetch leads: ${response.statusText}`);
      }
      const data = await response.json();
      // Map Supabase response to Lead interface
      return data.data || [];
    } catch (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
  }

  /**
   * Fetch a specific lead by ID from Supabase
   */
  async getLeadById(leadId: string): Promise<Lead | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/leads/${leadId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch lead: ${response.statusText}`);
      }
      const data = await response.json();
      // Return the data object or null if not found
      return data.data || null;
    } catch (error) {
      console.error('Error fetching lead:', error);
      return null;
    }
  }

  /**
   * Fetch meetings for a specific lead
   */
  async getMeetingsByLeadId(leadId: string): Promise<Meeting[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.leads.getMeetings(leadId)}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch meetings: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching meetings:', error);
      return [];
    }
  }
}

class MeetingService {
  /**
   * Fetch all meetings
   */
  async getAllMeetings(tenantId: string = 'tenant-001'): Promise<Meeting[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.meetings.getAll}?tenant_id=${tenantId}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch meetings: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching meetings:', error);
      return [];
    }
  }

  /**
   * Fetch a specific meeting by ID
   */
  async getMeetingById(meetingId: string): Promise<Meeting | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.meetings.getById(meetingId)}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch meeting: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching meeting:', error);
      return null;
    }
  }
}

export const leadService = new LeadService();
export const meetingService = new MeetingService();
