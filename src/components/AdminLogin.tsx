import { useState } from 'react';
import { X } from 'lucide-react';
import { signIn } from '../utils/auth';
import { signupAdmin } from '../utils/api';
import { showToast, validateRequired, handleNetworkError } from '../utils/errorHandling';

interface AdminLoginProps {
  onClose: () => void;
  onSuccess: () => void;
}

type AuthMode = 'login' | 'signup';

export function AdminLogin({ onClose, onSuccess }: AdminLoginProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Handle admin login with email and password verification.
   */
  async function handleLogin(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError('');

    const validationError = validateRequired({ email, password });
    if (validationError) {
      setError(validationError);
      showToast({ type: 'error', message: validationError });
      return;
    }

    setLoading(true);

    try {
      const data = await signIn(email, password);

      // Verify user has admin privileges
      if (!data.user?.user_metadata?.isAdmin) {
        const msg = 'Access denied. Admin privileges required.';
        setError(msg);
        showToast({ type: 'error', message: msg });
        return;
      }

      showToast({ type: 'success', message: 'Logged in successfully!' });
      onSuccess();
    } catch (err: any) {
      const errorMsg = handleNetworkError(err);
      setError(errorMsg);
      showToast({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  }

  /**
   * Handle admin signup with secret key verification.
   */
  async function handleSignup(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setError('');

    const validationError = validateRequired({ email, password, name, adminSecret });
    if (validationError) {
      setError(validationError);
      showToast({ type: 'error', message: validationError });
      return;
    }

    setLoading(true);

    try {
      // Create admin account with secret key
      await signupAdmin(email, password, name, adminSecret);

      // Automatically sign in after successful signup
      await signIn(email, password);
      showToast({ type: 'success', message: 'Admin account created successfully!' });
      onSuccess();
    } catch (err: any) {
      const errorMsg = handleNetworkError(err);
      setError(errorMsg);
      showToast({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-slate-900">
            {isSignup ? 'Admin Signup' : 'Admin Login'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-slate-700 mb-2 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 mb-2 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {isSignup && (
            <div>
              <label className="block text-slate-700 mb-2 text-sm">
                Admin Secret Key
              </label>
              <input
                type="password"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Contact system administrator"
                required
              />
              <p className="text-slate-500 text-xs mt-1">
                You need the admin secret key to create an admin account
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (isSignup ? 'Create Admin Account' : 'Sign In')}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
            }}
            className="text-indigo-600 hover:text-indigo-700 text-sm"
          >
            {isSignup ? 'Already have an account? Sign in' : 'Need an admin account? Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
}
