/**
 * ✨ Example: How to integrate user login with profile auto-fill
 * 
 * This example shows how to:
 * 1. Capture login email
 * 2. Store user ID in localStorage
 * 3. Trigger automatic profile loading
 */

import React, { useState } from 'react';
import { leadService } from '@/services/leadService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export const LoginExample: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // ✨ EXAMPLE LOGIN HANDLER
  const handleLogin = async () => {
    if (!email) {
      toast.error('Please enter an email');
      return;
    }

    try {
      setLoading(true);

      // ✨ STEP 1: Fetch all leads from database
      const leads = await leadService.getAllLeads();

      // ✨ STEP 2: Find user by email
      const userLead = leads.find(lead =>
        lead.contact_emails?.includes(email)
      );

      if (!userLead) {
        toast.error('User not found in database');
        return;
      }

      // ✨ STEP 3: Store user ID in localStorage
      // This triggers auto-population in UserProfileTab and CompanyProfileTab
      localStorage.setItem('logged_in_user_id', userLead.id);

      toast.success(`Welcome, ${userLead.first_name}!`);

      // ✨ STEP 4: Your other login logic here (redirect, etc)
      // Example: navigate to dashboard
      // window.location.href = '/dashboard';

    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to login');
    } finally {
      setLoading(false);
    }
  };

  // ✨ LOGOUT HANDLER
  const handleLogout = () => {
    localStorage.removeItem('logged_in_user_id');
    setEmail('');
    toast.success('Logged out successfully');
  };

  return (
    <div className="space-y-4 p-6 border rounded-lg max-w-md">
      <h2 className="text-xl font-bold">Login Example</h2>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input
          type="email"
          placeholder="e.g., michael@cloud.io"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
        />
        <p className="text-xs text-muted-foreground">
          Try: john.smith@techsolutions.com, sarah.johnson@dmp.com, michael@cloud.io
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleLogin}
          disabled={loading}
          className="flex-1"
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="flex-1"
        >
          Logout
        </Button>
      </div>

      <div className="p-3 bg-blue-50 rounded text-sm">
        <p className="font-semibold mb-2">💡 How it works:</p>
        <ol className="space-y-1 text-xs list-decimal list-inside">
          <li>User enters email and clicks Login</li>
          <li>System finds user in database by email</li>
          <li>User ID stored in localStorage</li>
          <li>Go to Settings → User Profile tab</li>
          <li>Data auto-populates automatically!</li>
        </ol>
      </div>
    </div>
  );
};

/**
 * ✨ INTEGRATION CHECKLIST
 * 
 * [ ] Import LeadService in your login component
 * [ ] Add handleLogin function with email lookup
 * [ ] Store user ID: localStorage.setItem('logged_in_user_id', userLead.id)
 * [ ] Add handleLogout function with: localStorage.removeItem('logged_in_user_id')
 * [ ] Test with sample data:
 *     - john.smith@techsolutions.com
 *     - sarah.johnson@dmp.com
 *     - michael@cloud.io
 * [ ] Navigate to Settings after login
 * [ ] Verify User Profile tab is auto-populated
 * [ ] Verify Company Profile tab is auto-populated
 */
