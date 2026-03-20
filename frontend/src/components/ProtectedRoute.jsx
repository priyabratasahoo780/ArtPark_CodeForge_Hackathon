import React from 'react';

/**
 * ProtectedRoute component to restrict access based on authentication and roles.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if authorized
 * @param {Array<string>} props.allowedRoles - List of roles permitted to access this route
 * @param {Object} props.auth - The current authentication state { token, role }
 */
const ProtectedRoute = ({ children, allowedRoles, auth }) => {
  if (!auth.token) {
    // Not logged in, the App component should handle the login gate, 
    // but as a fallback we show nothing.
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    // Role mismatch, show unauthorized
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center p-4">
        <div className="glass-card p-12 text-center max-w-md border-red-500/30">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl text-red-500">🚫</span>
          </div>
          <h2 className="text-2xl font-black uppercase italic italic mb-4">Access Denied</h2>
          <p className="text-gray-400 mb-8 border-l-2 border-red-500 pl-4 text-sm">
            Your current clearance level ({auth.role}) is insufficient to access this terminal.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="btn-secondary w-full py-3"
          >
            Return to Base
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
