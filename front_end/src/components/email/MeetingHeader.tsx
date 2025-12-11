import React from 'react';
import { MeetingSummary } from '@/types/meeting';
import { Calendar, Clock, User, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface MeetingHeaderProps {
  meeting: MeetingSummary;
}

export const MeetingHeader: React.FC<MeetingHeaderProps> = ({ meeting }) => {
  const formattedDate = format(new Date(meeting.meetingDate), 'MMMM d, yyyy');

  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold truncate">{meeting.recipientName}</h2>
          <p className="text-sm text-muted-foreground truncate">{meeting.recipientEmail}</p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{meeting.meetingTime}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-start gap-2">
          <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground line-clamp-2">{meeting.summary}</p>
        </div>
      </div>
    </div>
  );
};
