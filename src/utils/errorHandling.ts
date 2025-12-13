/**
 * Utility functions for error handling and user notifications
 */

export interface ToastOptions {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

/**
 * Display a toast notification to the user
 */
export function showToast({ type, message, duration = 4000 }: ToastOptions): void {
  // Check if toast container exists, create if not
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.style.cssText = `
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    pointer-events: auto;
    animation: slideIn 0.3s ease-out;
    max-width: 350px;
    word-wrap: break-word;
  `;

  // Set background color based on type
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6',
    warning: '#f59e0b',
  };
  toast.style.backgroundColor = colors[type];
  toast.textContent = message;

  container.appendChild(toast);

  // Auto remove after duration
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
      container?.removeChild(toast);
      if (container?.children.length === 0) {
        document.body.removeChild(container);
      }
    }, 300);
  }, duration);
}

/**
 * Extract user-friendly error message from various error types
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object') {
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
    if ('error' in error && typeof error.error === 'string') {
      return error.error;
    }
  }
  
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Handle network errors with user-friendly messages
 */
export function handleNetworkError(error: unknown): string {
  const message = getErrorMessage(error);
  
  // Provide more context for common errors
  if (message.includes('fetch')) {
    return 'Network error. Please check your internet connection.';
  }
  if (message.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }
  if (message.includes('unauthorized') || message.includes('401')) {
    return 'Authentication failed. Please log in again.';
  }
  if (message.includes('forbidden') || message.includes('403')) {
    return 'You do not have permission to perform this action.';
  }
  if (message.includes('not found') || message.includes('404')) {
    return 'Resource not found.';
  }
  if (message.includes('500') || message.includes('server error')) {
    return 'Server error. Please try again later.';
  }
  
  return message;
}

/**
 * Async wrapper that handles errors and shows toast notifications
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  options?: {
    successMessage?: string;
    errorMessage?: string;
    showSuccessToast?: boolean;
  }
): Promise<T | null> {
  try {
    const result = await fn();
    
    if (options?.showSuccessToast && options?.successMessage) {
      showToast({
        type: 'success',
        message: options.successMessage,
      });
    }
    
    return result;
  } catch (error) {
    const message = options?.errorMessage || handleNetworkError(error);
    showToast({
      type: 'error',
      message,
    });
    console.error('Error:', error);
    return null;
  }
}

/**
 * Validate form data
 */
export function validateRequired(fields: Record<string, any>): string | null {
  for (const [key, value] of Object.entries(fields)) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
    }
  }
  return null;
}

/**
 * Add animation keyframes to document if not already present
 */
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}
