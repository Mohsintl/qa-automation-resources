import { publicAnonKey } from './supabase/info';
import { apiConfig } from '../config';

// Constants
const HEADERS_JSON = {
  'Content-Type': 'application/json',
} as const;

const REQUEST_TIMEOUT = 30000; // 30 seconds

/**
 * Helper to parse API error responses.
 * @param response - Fetch response object
 * @returns Error message from response or generic message
 */
async function parseError(response: Response): Promise<string> {
  try {
    const error = await response.json();
    return error.error || error.message || `Request failed with status ${response.status}`;
  } catch {
    return `Request failed with status ${response.status}`;
  }
}

/**
 * Wrapper for fetch with timeout and error handling
 */
async function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    if (!navigator.onLine) {
      throw new Error('No internet connection. Please check your network.');
    }
    throw new Error('Network error. Please check your connection and try again.');
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
  if (!type || !data) {
    throw new Error('Type and data are required');
  }

  const response = await fetchWithTimeout(`${apiConfig.endpoints.submissions}`, {
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
  if (!accessToken) {
    throw new Error('Access token is required');
  }

  const response = await fetchWithTimeout(`${apiConfig.endpoints.adminPending}`, {
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
  if (!submissionId || !action || !accessToken) {
    throw new Error('Submission ID, action, and access token are required');
  }

  const response = await fetchWithTimeout(`${apiConfig.endpoints.adminReview}`, {
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
  if (!type) {
    throw new Error('Content type is required');
  }

  const response = await fetchWithTimeout(`${apiConfig.endpoints.approvedContent}/${type}`, {
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
  if (!email || !password || !name || !adminSecret) {
    throw new Error('All fields are required');
  }

  const response = await fetchWithTimeout(`${apiConfig.endpoints.adminSignup}`, {
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
