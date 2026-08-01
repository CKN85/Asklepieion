import React, { useState } from 'react';
import { base44 } from '@/api/client';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      // Hash route — a plain "/admin" would ask the server for a path that
      // doesn't exist on GitHub Pages.
      window.location.href = '#/admin';
    } catch (err) {
      setError("Invalid credentials. The Scribe's Chamber admits only its keeper.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0C09] flex items-center justify-center px-8">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(201,168,76,0.03) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="font-heading text-[#3F8A66] text-4xl mb-3">⚕</div>
          <div className="font-heading text-[#E2DED0] text-2xl font-light mb-1">The Scribe's Chamber</div>
          <div className="label-caps text-[#3A3530] text-[9px] tracking-[0.25em]">Asklepieion · Admin</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="label-caps text-[#3A3530] text-[9px] tracking-[0.2em] block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="username"
              className="w-full bg-[#1A1815] border border-[#2A2620] text-[#E2DED0] px-4 py-3 focus:outline-none focus:border-[#3F8A66] transition-colors placeholder:text-[#2A2620]"
              style={{ fontFamily: 'Source Serif 4, Georgia, serif' }}
            />
          </div>
          <div className="mb-6">
            <label className="label-caps text-[#3A3530] text-[9px] tracking-[0.2em] block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-[#1A1815] border border-[#2A2620] text-[#E2DED0] px-4 py-3 focus:outline-none focus:border-[#3F8A66] transition-colors"
              style={{ fontFamily: 'Source Serif 4, Georgia, serif' }}
            />
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 border border-red-900/40 bg-red-950/20">
              <p style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '0.8rem', color: '#F87171', fontStyle: 'italic' }}>
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full label-caps text-[#3F8A66] border border-[#3F8A66]/40 py-3 hover:bg-[#3F8A66]/10 transition-all duration-200 text-[10px] tracking-[0.25em] disabled:opacity-40"
          >
            {loading ? 'Entering...' : 'Enter'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <a href="#/" className="label-caps text-[#2A2620] hover:text-[#3A3530] text-[9px] tracking-[0.2em] transition-colors">
            ← Return to the Sanctuary
          </a>
        </div>
      </div>
    </div>
  );
}
