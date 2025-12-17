/**
 * QA Automation Resource Backend - Node.js/Express Version
 * Provides REST API endpoints for public submissions and admin review workflows.
 * Uses Express framework with Supabase integration for data persistence.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createClient } from '@supabase/supabase-js';
import * as kv from './kv_store';

// Environment variables
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const PORT = process.env.PORT || 3001;

// Initialize Express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Types
interface Submission {
  id: string;
  type: string;
  data: any;
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy: string | null;
  reviewedAt: string | null;
}

// Submit new content (public)
app.post('/api/submissions', async (req, res) => {
  try {
    const { type, data, submittedBy } = req.body;

    if (!type || !data) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate unique ID for submission
    const submissionId = `submission_${type}_${Date.now()}`;

    // Store submission in KV store with pending status
    const submission: Submission = {
      id: submissionId,
      type, // cheatsheet, template, testcase, testscript
      data,
      submittedBy: submittedBy || 'Anonymous',
      submittedAt: new Date().toISOString(),
      status: 'pending', // pending, approved, rejected
      reviewedBy: null,
      reviewedAt: null,
    };

    await kv.set(submissionId, submission);

    // Also add to a list of pending submissions for easy retrieval
    const pendingKey = `pending_${type}`;
    const existingPending = await kv.get(pendingKey) || { submissions: [] };
    existingPending.submissions.push(submissionId);
    await kv.set(pendingKey, existingPending);

    res.json({ success: true, submissionId });
  } catch (error) {
    console.error('Error submitting content:', error);
    res.status(500).json({ error: 'Failed to submit content' });
  }
});

// Get all pending submissions (admin only)
app.get('/api/admin/pending', async (req, res) => {
  try {
    // Check admin authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - Admin access required' });
    }

    const accessToken = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user || authError) {
      return res.status(401).json({ error: 'Unauthorized - Admin access required' });
    }

    // Get user metadata to check if admin
    const userMeta = user.user_metadata;
    if (!userMeta?.isAdmin) {
      return res.status(403).json({ error: 'Forbidden - Admin privileges required' });
    }

    // Get all pending submissions
    const types = ['cheatsheet', 'template', 'testcase', 'testscript', 'boilerplate'];
    const allSubmissions: Submission[] = [];

    for (const type of types) {
      const pendingKey = `pending_${type}`;
      const pendingData = await kv.get(pendingKey);

      if (pendingData?.submissions) {
        for (const subId of pendingData.submissions) {
          const submission = await kv.get(subId);
          if (submission && submission.status === 'pending') {
            allSubmissions.push(submission);
          }
        }
      }
    }

    res.json({ submissions: allSubmissions });
  } catch (error) {
    console.error('Error fetching pending submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Approve or reject submission (admin only)
app.post('/api/admin/review', async (req, res) => {
  try {
    // Check admin authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - Admin access required' });
    }

    const accessToken = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user || authError) {
      return res.status(401).json({ error: 'Unauthorized - Admin access required' });
    }

    // Check if user is admin
    const userMeta = user.user_metadata;
    if (!userMeta?.isAdmin) {
      return res.status(403).json({ error: 'Forbidden - Admin privileges required' });
    }

    const { submissionId, action } = req.body; // action: 'approve' or 'reject'

    if (!submissionId || !action) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get submission
    const submission = await kv.get(submissionId);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Update submission status
    submission.status = action === 'approve' ? 'approved' : 'rejected';
    submission.reviewedBy = user.email;
    submission.reviewedAt = new Date().toISOString();

    await kv.set(submissionId, submission);

    // If approved, add to approved content list
    if (action === 'approve') {
      const approvedKey = `approved_${submission.type}`;
      const existingApproved = await kv.get(approvedKey) || { items: [] };
      existingApproved.items.push(submission.data);
      await kv.set(approvedKey, existingApproved);
    }

    // Remove from pending list
    const pendingKey = `pending_${submission.type}`;
    const pendingData = await kv.get(pendingKey);
    if (pendingData?.submissions) {
      pendingData.submissions = pendingData.submissions.filter(id => id !== submissionId);
      await kv.set(pendingKey, pendingData);
    }

    res.json({ success: true, submission });
  } catch (error) {
    console.error('Error reviewing submission:', error);
    res.status(500).json({ error: 'Failed to review submission' });
  }
});

// Get all approved content by type
app.get('/api/approved/:type', async (req, res) => {
  try {
    const type = req.params.type;
    const approvedKey = `approved_${type}`;
    const approvedData = await kv.get(approvedKey);

    res.json({ items: approvedData?.items || [] });
  } catch (error) {
    console.error('Error fetching approved content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Admin signup route
app.post('/api/admin/signup', async (req, res) => {
  try {
    const { email, password, name, adminSecret } = req.body;

    // Check admin secret
    const ADMIN_SECRET = process.env.ADMIN_SECRET || 'change-this-secret';
    if (adminSecret !== ADMIN_SECRET) {
      return res.status(403).json({ error: 'Invalid admin secret' });
    }

    // Create admin user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        name,
        isAdmin: true
      },
      email_confirm: true, // Auto-confirm since email server not configured
    });

    if (error) {
      console.error('Error creating admin user:', error);
      return res.status(error.status || 400).json({ error: error.message });
    }

    res.json({ success: true, user: data.user });
  } catch (error) {
    console.error('Error in admin signup:', error);
    res.status(500).json({ error: 'Failed to create admin account' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 QA Backend Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;