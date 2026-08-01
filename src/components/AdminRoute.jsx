import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { base44 } from '@/api/client';

export default function AdminRoute() {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    base44.auth
      .isAuthenticated()
      .then(auth => setStatus(auth ? 'authenticated' : 'unauthenticated'))
      .catch(() => setStatus('unauthenticated'));
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0E0C09] flex items-center justify-center">
        <div className="w-6 h-6 border border-[#3A3530] border-t-[#3F8A66] rounded-full animate-spin" />
      </div>
    );
  }

  return status === 'authenticated' ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
