"use client";

import React, { useState, useEffect } from 'react';
import { apiUrl } from '@/lib/apiUrl';
import { formatShortDate } from '@/lib/dateUtils';

const EmployerPortal = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    category: 'Other',
    jobType: 'Full-time',
    description: '',
    email: '',
    phoneNumber: ''
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' or 'profile'
  const [companyData, setCompanyData] = useState({
    name: '',
    logoUrl: ''
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(apiUrl('/api/auth/me'));
        const json = await res.json();
        if (res.ok && json.success) {
          setCurrentUser(json.data);
          if (json.data.company) {
            setCompanyData({
              name: json.data.company.name || '',
              logoUrl: json.data.company.logoUrl || ''
            });
          }
        }
      } finally {
        setAuthLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (currentUser?.role === 'CORPORATION') {
      fetchJobs();
    }
  }, [currentUser]);

  const fetchJobs = async () => {
    setJobsLoading(true);
    try {
      const res = await fetch(apiUrl('/api/employer/jobs'));
      const json = await res.json();
      if (json?.success) setJobs(json.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setJobsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      const res = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();
      if (json?.success) {
        setCurrentUser(json.data);
        setEmail('');
        setPassword('');
      } else {
        setAuthError(json?.error || 'Login failed');
      }
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError(null);
    try {
      const res = await fetch(apiUrl('/api/employer/profile'), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyData)
      });
      const json = await res.json();
      if (json?.success) {
        showMessage('Profile updated successfully');
        setCurrentUser({ ...currentUser, company: json.data });
      } else {
        setProfileError(json?.error || 'Failed to update profile');
      }
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch(apiUrl('/api/auth/logout'), { method: 'POST' });
    setCurrentUser(null);
    setJobs([]);
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const resetForm = () => {
    setFormData({
      jobTitle: '',
      company: '',
      category: 'Other',
      jobType: 'Full-time',
      description: '',
      email: '',
      phoneNumber: ''
    });
    setShowJobForm(false);
    setEditingJob(null);
    setFormError(null);
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      jobTitle: job.jobTitle || job.aiTitle || '',
      company: job.company || '',
      category: job.category || 'Other',
      jobType: job.jobType || 'Full-time',
      description: job.description || job.aiDescription || '',
      email: job.emailInfo || '',
      phoneNumber: job.phoneNumber || ''
    });
    setShowJobForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.jobTitle || !formData.description) {
      setFormError('Job title and description are required');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const url = editingJob 
        ? apiUrl(`/api/employer/jobs/${editingJob.id}`)
        : apiUrl('/api/employer/jobs');
      const method = editingJob ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();

      if (json?.success) {
        showMessage(editingJob ? 'Job updated successfully' : 'Job posted successfully');
        resetForm();
        fetchJobs();
      } else {
        setFormError(json?.error || 'Failed to save job');
      }
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!confirm('Delete this job posting? This cannot be undone.')) return;
    try {
      const res = await fetch(apiUrl(`/api/employer/jobs/${jobId}`), { method: 'DELETE' });
      const json = await res.json();
      if (json?.success) {
        showMessage('Job deleted successfully');
        fetchJobs();
      } else {
        showMessage(json?.error || 'Failed to delete job');
      }
    } catch (err) {
      showMessage('Error deleting job');
    }
  };

  // Loading state
  if (authLoading && !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Login form
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Employer Portal</h1>
              <p className="text-gray-600 mt-2">Sign in to manage your job postings</p>
            </div>

            {authError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  placeholder="employer@company.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {authLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Need an employer account? Contact the site administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Not a corporation
  if (currentUser.role !== 'CORPORATION') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">This portal is only for corporation employer accounts.</p>
          <button onClick={handleLogout} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // Employer Dashboard
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">Employer Portal</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                <span className="font-medium">{currentUser.email}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Success Message */}
      {message && (
        <div className="fixed top-20 right-4 z-50 animate-fade-in">
          <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {message}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-6 py-3 font-medium text-sm transition-colors relative ${
              activeTab === 'jobs' ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Job Postings
            {activeTab === 'jobs' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 font-medium text-sm transition-colors relative ${
              activeTab === 'profile' ? 'text-purple-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Company Profile
            {activeTab === 'profile' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></div>}
          </button>
        </div>

        {activeTab === 'jobs' ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Your Job Postings</h1>
                <p className="text-gray-600 mt-1">Manage your company&apos;s job listings</p>
              </div>
              <button
                onClick={() => setShowJobForm(!showJobForm)}
                className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Post New Job
              </button>
            </div>
            {/* Job Form */}
            {showJobForm && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingJob ? 'Edit Job Posting' : 'Post a New Job'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {formError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{formError}</div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                      <input
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                        placeholder="e.g. Senior Accountant"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                        placeholder="Your company name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                      >
                        <option value="Other">Other</option>
                        <option value="Office">Office</option>
                        <option value="Retail">Retail</option>
                        <option value="Sales">Sales</option>
                        <option value="Finance">Finance</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                        <option value="Technical">Technical</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                      <select
                        value={formData.jobType}
                        onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Remote">Remote</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                        placeholder="hr@company.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="text"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                        placeholder="718-000-0000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
                      placeholder="Describe the role, requirements, and benefits..."
                    ></textarea>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
                    >
                      {saving ? 'Saving...' : editingJob ? 'Update Job' : 'Post Job'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Jobs List */}
            {jobsLoading ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading your jobs...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No job postings yet</h3>
                <p className="text-gray-600 mb-6">Create your first job posting to get started</p>
                <button
                  onClick={() => setShowJobForm(true)}
                  className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Post Your First Job
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{job.aiTitle || job.jobTitle}</h3>
                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                          {job.company && <span>{job.company}</span>}
                          <span className="px-2 py-0.5 bg-gray-100 rounded">{job.category}</span>
                          {job.jobType && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded">{job.jobType}</span>}
                        </div>
                        <p className="mt-3 text-gray-600 text-sm line-clamp-2">
                          {job.aiDescription || job.description}
                        </p>
                        <p className="mt-2 text-xs text-gray-400">
                          Posted {formatShortDate(job.jobDate || job.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(job)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Company Profile</h1>
            <p className="text-gray-600 mb-8">Update your company information shown on job postings</p>
            
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {profileError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{profileError}</div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={companyData.name}
                    onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    placeholder="e.g. Acme Corp"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                  <div className="flex gap-4 items-start">
                    <div className="flex-1">
                      <input
                        type="url"
                        value={companyData.logoUrl}
                        onChange={(e) => setCompanyData({ ...companyData, logoUrl: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                        placeholder="https://example.com/logo.png"
                      />
                      <p className="mt-2 text-xs text-gray-500">Provide a direct link to your company logo image.</p>
                    </div>
                    {companyData.logoUrl && (
                      <div className="w-16 h-16 border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                        <img 
                          src={companyData.logoUrl} 
                          alt="Logo preview" 
                          className="w-full h-full object-contain"
                          onError={(e) => e.target.src = 'https://via.placeholder.com/64?text=Error'}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 transition-colors"
                  >
                    {profileSaving ? 'Saving Changes...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerPortal;
