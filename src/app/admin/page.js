"use client";

import React, { useState, useEffect } from 'react';
import { apiUrl } from '@/lib/apiUrl';

const AdminPage = () => {
  const [idInput, setIdInput] = useState('');
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleFetch = async (e) => {
    e && e.preventDefault();
    setError(null);
    setMessage(null);
    setJob(null);

    const id = parseInt(idInput);
    if (isNaN(id)) {
      setError('Enter a valid ID');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(apiUrl(`/api/jobs/${id}`));
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error || 'Error fetching job');
      } else if (json && json.success) {
        setJob(json.data);
      } else {
        setError(json?.error || 'Not found');
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(apiUrl('/api/auth/me'));
        const json = await res.json();
        if (res.ok && json.success && mounted) setCurrentUser(json.data);
      } catch (err) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleLogin = async (e) => {
    e && e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      const res = await fetch(apiUrl('/api/auth/login'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const json = await res.json();
      if (!res.ok) {
        setAuthError(json?.error || 'Login failed');
      } else if (json && json.success) {
        setCurrentUser(json.data);
        setEmail(''); setPassword('');
      }
    } catch (err) {
      setAuthError(err.message || 'Network error');
    } finally {
      setAuthLoading(false);
    }
  };

  

  const handleDelete = async () => {
  if (!job) return;
  if (!currentUser || currentUser.role !== 'ADMIN') {
    setError('You do not have permission to delete jobs');
    return;
  }
  if (!confirm(`Delete job with ID ${job.id}? This action cannot be undone.`)) return;

    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(apiUrl(`/api/jobs/${job.id}`), { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error || 'Error deleting');
      } else if (json && json.success) {
        setMessage(`Job ${json.data.id} deleted.`);
        setJob(null);
        setIdInput('');
      } else {
        setError(json?.error || 'Could not delete');
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
  <h1 className="text-2xl font-bold mb-4">Admin - Find and Delete Jobs</h1>

      {/* Auth / Login */}
      {!currentUser ? (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Admin login</h2>
          {authError && <div className="text-red-600 mb-2">{authError}</div>}
          <form onSubmit={handleLogin} className="flex gap-2 mb-4 items-center">
            <input className="px-3 py-2 border rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" className="px-3 py-2 border rounded" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit" disabled={authLoading}>{authLoading ? 'Please wait...' : 'Login'}</button>
          </form>
        </div>
      ) : (
        <div className="mb-4">
          <div className="text-sm text-gray-700">Signed in as <strong>{currentUser.email}</strong> ({currentUser.role})</div>
          <div className="mt-2">
            <button className="bg-gray-200 px-3 py-1 rounded text-sm" onClick={async () => { await fetch(apiUrl('/api/auth/logout'), { method: 'POST' }); setCurrentUser(null); }}>Logout</button>
          </div>
        </div>
      )}

      {currentUser ? (
        currentUser.role === 'ADMIN' ? (
          <form onSubmit={handleFetch} className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Job ID"
              value={idInput}
              onChange={(e) => setIdInput(e.target.value)}
              className="px-4 py-2 border rounded w-48"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button
              type="button"
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
              onClick={() => { setIdInput(''); setJob(null); setError(null); setMessage(null); }}
            >
              Clear
            </button>
          </form>
        ) : (
          <div className="mb-4 text-yellow-600">You are signed in but do not have admin permissions.</div>
        )
      ) : (
        <div className="mb-6 text-gray-600">Please log in with an admin account to search and manage jobs.</div>
      )}

      {error && <div className="mb-4 text-red-600">{error}</div>}
      {message && <div className="mb-4 text-green-600">{message}</div>}

      {job ? (
        <div className="border rounded p-4 bg-white shadow">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold">{job.jobTitle || 'Untitled'}</h2>
              <p className="text-sm text-gray-600">Company: {job.company || '—'}</p>
              <p className="text-sm text-gray-600">Category: {job.category || '—'}</p>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>ID: {job.id}</div>
              <div>{job.jobDate ? new Date(job.jobDate).toLocaleString() : ''}</div>
            </div>
          </div>

          <div className="mt-4 text-gray-700">
            <h3 className="font-medium">Description</h3>
            <p className="whitespace-pre-wrap">{job.description || job.aiDescription || '—'}</p>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              className="bg-red-600 text-white px-4 py-2 rounded"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Job'}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-gray-600">Enter an ID and press Search to view the job.</div>
      )}
    </div>
  );
};

export default AdminPage;
