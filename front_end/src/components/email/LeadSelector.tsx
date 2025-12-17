import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { leadService, meetingService, Lead, Meeting } from '@/services/leadService';

interface LeadSelectorProps {
  onSelectLead: (lead: Lead) => void;
  onSelectMeeting: (meeting: Meeting) => void;
}

export const LeadSelector: React.FC<LeadSelectorProps> = ({
  onSelectLead,
  onSelectMeeting,
}) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Fetch all leads on component mount
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await leadService.getAllLeads();
      setLeads(data);
      if (data.length > 0) {
        toast.success(`Loaded ${data.length} leads`);
      } else {
        toast.info('No leads found');
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSelect = async (leadId: string) => {
    setSelectedLeadId(leadId);
    
    // Get the selected lead
    const lead = leads.find((l) => l.id === leadId);
    if (lead) {
      onSelectLead(lead);
    }

    // Fetch meetings for this lead
    try {
      const meetingsData = await leadService.getMeetingsByLeadId(leadId);
      setMeetings(meetingsData);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      toast.error('Failed to load meetings for this lead');
    }
  };

  const handleMeetingSelect = (meeting: Meeting) => {
    onSelectMeeting(meeting);
    toast.success(`Selected meeting: ${meeting.name}`);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <div>
        <Label className="text-base font-semibold">Select a Lead</Label>
        <div className="mt-2 space-y-2">
          {loading ? (
            <p className="text-gray-500">Loading leads...</p>
          ) : leads.length === 0 ? (
            <p className="text-gray-500">No leads available</p>
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-2">
              {leads.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => handleLeadSelect(lead.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedLeadId === lead.id
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold">
                    {lead.first_name} {lead.last_name}
                  </div>
                  <div className="text-sm text-gray-600">{lead.company_name}</div>
                  {lead.job_title && (
                    <div className="text-xs text-gray-500">{lead.job_title}</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {meetings.length > 0 && (
        <div>
          <Label className="text-base font-semibold">Meetings for Selected Lead</Label>
          <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
            {meetings.map((meeting) => (
              <button
                key={meeting.id}
                onClick={() => handleMeetingSelect(meeting)}
                className="w-full text-left p-3 rounded-lg bg-white border border-gray-200 hover:border-green-500 transition-colors"
              >
                <div className="font-semibold">{meeting.name}</div>
                <div className="text-sm text-gray-600">{meeting.email}</div>
                {meeting.scheduled_date && (
                  <div className="text-xs text-gray-500">{meeting.scheduled_date}</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <Button
        variant="outline"
        onClick={fetchLeads}
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Loading...' : 'Refresh Leads'}
      </Button>
    </div>
  );
};
