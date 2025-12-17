/**
 * Supabase Edge Function for handling QA content submissions and admin operations.
 * Provides REST API endpoints for public submissions and admin review workflows.
 * Uses Deno runtime with Hono framework and KV store for data persistence.
 */

import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

// Initialize Hono app with middleware
const app = new Hono();
app.use('*', cors());
app.use('*', logger(console.log));

// Initialize Supabase client with service role key for server-side operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Submit new content (public)
app.post('/make-server-6e41de3d/submissions', async (c) => {
  try {
    const body = await c.req.json();
    const { type, data, submittedBy } = body;

    if (!type || !data) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Generate unique ID for submission
    const submissionId = `submission_${type}_${Date.now()}`;

    // Store submission in KV store with pending status
    const submission = {
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

    return c.json({ success: true, submissionId });
  } catch (error) {
    console.error('Error submitting content:', error);
    return c.json({ error: 'Failed to submit content' }, 500);
  }
});

// Get all pending submissions (admin only)
app.get('/make-server-6e41de3d/admin/pending', async (c) => {
  try {
    // Check admin authentication
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized - Admin access required' }, 401);
    }

    // Get user metadata to check if admin
    const userMeta = user.user_metadata;
    if (!userMeta?.isAdmin) {
      return c.json({ error: 'Forbidden - Admin privileges required' }, 403);
    }

    // Get all pending submissions
    const types = ['cheatsheet', 'template', 'testcase', 'testscript', 'boilerplate'];
    const allSubmissions = [];

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

    return c.json({ submissions: allSubmissions });
  } catch (error) {
    console.error('Error fetching pending submissions:', error);
    return c.json({ error: 'Failed to fetch submissions' }, 500);
  }
});

// Approve or reject submission (admin only)
app.post('/make-server-6e41de3d/admin/review', async (c) => {
  try {
    // Check admin authentication
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized - Admin access required' }, 401);
    }

    // Check if user is admin
    const userMeta = user.user_metadata;
    if (!userMeta?.isAdmin) {
      return c.json({ error: 'Forbidden - Admin privileges required' }, 403);
    }

    const { submissionId, action } = await c.req.json(); // action: 'approve' or 'reject'

    if (!submissionId || !action) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Get submission
    const submission = await kv.get(submissionId);
    if (!submission) {
      return c.json({ error: 'Submission not found' }, 404);
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

    return c.json({ success: true, submission });
  } catch (error) {
    console.error('Error reviewing submission:', error);
    return c.json({ error: 'Failed to review submission' }, 500);
  }
});

// Get all approved content by type
app.get('/make-server-6e41de3d/approved/:type', async (c) => {
  try {
    const type = c.req.param('type');
    const approvedKey = `approved_${type}`;
    const approvedData = await kv.get(approvedKey);

    return c.json({ items: approvedData?.items || [] });
  } catch (error) {
    console.error('Error fetching approved content:', error);
    return c.json({ error: 'Failed to fetch content' }, 500);
  }
});

// Admin signup route
app.post('/make-server-6e41de3d/admin/signup', async (c) => {
  try {
    const { email, password, name, adminSecret } = await c.req.json();

    // Check admin secret (you should set this as environment variable)
    const ADMIN_SECRET = Deno.env.get('ADMIN_SECRET') || 'change-this-secret';
    if (adminSecret !== ADMIN_SECRET) {
      return c.json({ error: 'Invalid admin secret' }, 403);
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
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.error('Error in admin signup:', error);
    return c.json({ error: 'Failed to create admin account' }, 500);
  }
});

Deno.serve(app.fetch);