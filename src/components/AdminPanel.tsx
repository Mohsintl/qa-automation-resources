import { useState, useEffect } from 'react';
import { Check, X, Eye, LogOut } from 'lucide-react';
import { getPendingSubmissions, reviewSubmission } from '../utils/api';
import { getSession, signOut } from '../utils/auth';
import type { User } from '@supabase/supabase-js';

interface AdminPanelProps {
  user: User;
}

interface Submission {
  id: string;
  [key: string]: any;
}

export function AdminPanel({ user }: AdminPanelProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [accessToken, setAccessToken] = useState('');

  // Load pending submissions on component mount
  useEffect(() => {
    loadSubmissions();
  }, []);

  /**
   * Fetch pending submissions from the server.
   */
  async function loadSubmissions(): Promise<void> {
    try {
      setLoading(true);
      const session = await getSession();
      if (!session?.access_token) {
        setError('Not authenticated');
        return;
      }

      setAccessToken(session.access_token);
      const data = await getPendingSubmissions(session.access_token);
      setSubmissions(data.submissions || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load submissions');
      console.error('Failed to load submissions:', err);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Submit approval or rejection of a submission.
   * @param submissionId - ID of submission to review
   * @param action - approve or reject
   */
  async function handleReview(submissionId: string, action: 'approve' | 'reject'): Promise<void> {
    try {
      await reviewSubmission(submissionId, action, accessToken);

      // Remove reviewed submission from the list
      setSubmissions(submissions.filter(s => s.id !== submissionId));
      setSelectedSubmission(null);

      const message = action === 'approve'
        ? 'Submission approved successfully!'
        : 'Submission rejected successfully!';
      alert(message);

      // Notify other parts of the app that content has been updated
      // Components that show approved content can listen for this event and refetch.
      window.dispatchEvent(new CustomEvent('content-updated'));
    } catch (err: any) {
      alert(err.message || 'Failed to review submission');
      console.error('Failed to review submission:', err);
    }
  }

  /**
   * Sign out the admin and reload the page.
   */
  async function handleSignOut(): Promise<void> {
    try {
      await signOut();
      window.location.reload();
    } catch (err) {
      console.error('Failed to sign out:', err);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-slate-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-slate-900 mb-2">Admin Panel</h2>
          <p className="text-slate-600">Welcome, {user.user_metadata?.name || user.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">
          Pending Submissions ({submissions.length})
        </h3>

        {submissions.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No pending submissions</p>
        ) : (
          <div className="space-y-3">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                        {submission.type}
                      </span>
                      <span className="text-slate-600 text-sm">
                        by {submission.submittedBy}
                      </span>
                      <span className="text-slate-400 text-xs">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {submission.type === 'cheatsheet' && (
                      <div>
                        <p className="text-slate-900">{submission.data.title}</p>
                        <p className="text-slate-600 text-sm">{submission.data.description}</p>
                      </div>
                    )}

                    {submission.type === 'template' && (
                      <div>
                        <p className="text-slate-900">{submission.data.title}</p>
                        <p className="text-slate-600 text-sm">{submission.data.category}</p>
                      </div>
                    )}

                    {submission.type === 'testcase' && (
                      <div>
                        <p className="text-slate-900">{submission.data.title}</p>
                        <p className="text-slate-600 text-sm">
                          {submission.data.app} - {submission.data.priority}
                        </p>
                      </div>
                    )}

                    {submission.type === 'testscript' && (
                      <div>
                        <p className="text-slate-900">{submission.data.title}</p>
                        <p className="text-slate-600 text-sm">
                          {submission.data.framework} - {submission.data.app}
                        </p>
                      </div>
                    )}

                    {submission.type === 'boilerplate' && (
                      <div>
                        <p className="text-slate-900">{submission.data.title}</p>
                        <p className="text-slate-600 text-sm">
                          {submission.data.framework} - {submission.data.language}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedSubmission(submission)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4 text-slate-700" />
                    </button>
                    <button
                      onClick={() => handleReview(submission.id, 'approve')}
                      className="p-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                      title="Approve"
                    >
                      <Check className="w-4 h-4 text-green-700" />
                    </button>
                    <button
                      onClick={() => handleReview(submission.id, 'reject')}
                      className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                      title="Reject"
                    >
                      <X className="w-4 h-4 text-red-700" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-900">Submission Preview</h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1 hover:bg-slate-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <pre className="text-sm text-slate-700 whitespace-pre-wrap">
                {JSON.stringify(selectedSubmission.data, null, 2)}
              </pre>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  handleReview(selectedSubmission.id, 'approve');
                }}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  handleReview(selectedSubmission.id, 'reject');
                }}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
