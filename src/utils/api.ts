import { publicAnonKey } from './supabase/info';
import { apiConfig } from '../config';

// Constants
const HEADERS_JSON = {
  'Content-Type': 'application/json',
} as const;

/**
 * Helper to parse API error responses.
 * @param response - Fetch response object
 * @returns Error message from response or generic message
 */
async function parseError(response: Response): Promise<string> {
  try {
    const error = await response.json();
    return error.error || 'Request failed';
  } catch {
    return 'Request failed';
  }
}

/**
 * Submit user-generated content (cheatsheet, template, etc.) for admin review.
 * @param type - Content type (cheatsheet, template, testcase, testscript)
 * @param data - Content data
 * @param submittedBy - Optional creator name
 * @returns Server response with submission confirmation
 * @throws Error if submission fails
 */
export async function submitContent(
  type: string,
  data: Record<string, any>,
  submittedBy?: string
): Promise<any> {
  const response = await fetch(`${apiConfig.endpoints.submissions}`, {
    method: 'POST',
    headers: {
      ...HEADERS_JSON,
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ type, data, submittedBy }),
  });

  if (!response.ok) {
    const error = await parseError(response);
    throw new Error(error);
  }

  return response.json();
}

/**
 * Fetch pending submissions for admin review.
 * @param accessToken - Admin's access token
 * @returns List of pending submissions
 * @throws Error if fetch fails
 */
export async function getPendingSubmissions(accessToken: string): Promise<any> {
  const response = await fetch(`${apiConfig.endpoints.adminPending}`, {
    method: 'GET',
    headers: {
      ...HEADERS_JSON,
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await parseError(response);
    throw new Error(error);
  }

  return response.json();
}

/**
 * Admin endpoint to approve or reject a submission.
 * @param submissionId - Submission identifier
 * @param action - approve or reject
 * @param accessToken - Admin's access token
 * @returns Server response with result
 * @throws Error if review fails
 */
export async function reviewSubmission(
  submissionId: string,
  action: 'approve' | 'reject',
  accessToken: string
): Promise<any> {
  const response = await fetch(`${apiConfig.endpoints.adminReview}`, {
    method: 'POST',
    headers: {
      ...HEADERS_JSON,
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ submissionId, action }),
  });

  if (!response.ok) {
    const error = await parseError(response);
    throw new Error(error);
  }

  return response.json();
}

/**
 * Fetch approved content by type.
 * @param type - Content type filter (cheatsheet, template, etc.)
 * @returns List of approved content
 * @throws Error if fetch fails
 */
export async function getApprovedContent(type: string): Promise<any> {
  const response = await fetch(`${apiConfig.endpoints.approvedContent}/${type}`, {
    method: 'GET',
    headers: {
      ...HEADERS_JSON,
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    const error = await parseError(response);
    throw new Error(error);
  }

  return response.json();
}

/**
 * Create a new admin account with a secret key.
 * @param email - Admin email
 * @param password - Admin password
 * @param name - Admin name
 * @param adminSecret - Secret key to authorize admin creation
 * @returns Server response with admin account details
 * @throws Error if signup fails
 */
export async function signupAdmin(
  email: string,
  password: string,
  name: string,
  adminSecret: string
): Promise<any> {
  const response = await fetch(`${apiConfig.endpoints.adminSignup}`, {
    method: 'POST',
    headers: {
      ...HEADERS_JSON,
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ email, password, name, adminSecret }),
  });

  if (!response.ok) {
    const error = await parseError(response);
    throw new Error(error);
  }

  return response.json();
}
