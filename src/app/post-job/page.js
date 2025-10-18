'use client';

import React, { useState } from 'react';

export default function PostJobPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    jobTitle: '',
    description: '',
    location: '',
    role: '',
    jobType: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // basic client-side validation
    if (!form.jobTitle || !form.description) {
      setMessage({ type: 'error', text: 'Please provide a job title and description.' });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/jobs/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Job posted successfully. It may take a minute to appear.' });
        setForm({ name: '', email: '', company: '', jobTitle: '', description: '', location: '', role: '', jobType: '', phoneNumber: '' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to post job.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left - Form */}
            <div className="p-8 lg:p-12">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between items-center text-center sm:text-left">
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900">Post a job</h1>
                  <p className="mt-2 text-sm text-gray-600">No account required — submit a job and it will be reviewed.</p>
                </div>
              <div className="flex items-center text-center mt-4 sm:mt-0 ml-4">
  <div className="text-sm text-gray-500 mr-2">Estimated time</div>
  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-700 text-lg font-bold">
    2
    <span className="text-sm font-semibold ml-1">min</span>
  </div>
</div>
              </div>

              {message && (
                <div className={`mt-6 p-3 rounded-lg ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Your name</span>
                    <input name="name" value={form.name} onChange={handleChange} className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Full name" />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Your email</span>
                    <input name="email" type="email" value={form.email} onChange={handleChange} className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="hello@company.com" />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Company</span>
                    <input name="company" value={form.company} onChange={handleChange} className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Company name" />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Job title</span>
                    <input name="jobTitle" value={form.jobTitle} onChange={handleChange} className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Sales Associate, Driver, etc." />
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Description</span>
                  <textarea name="description" value={form.description} onChange={handleChange} className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-48" placeholder="Describe the role, requirements, pay, hours, location..." />
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Location</span>
                    <input name="location" value={form.location} onChange={handleChange} className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Boro Park" />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Role</span>
                    <select name="role" value={form.role} onChange={handleChange} className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Choose a role...</option>
                      <option>Manager</option>
                      <option>Sales</option>
                      <option>Driver</option>
                      <option>Other</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-700">Job type</span>
                    <select name="jobType" value={form.jobType} onChange={handleChange} className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Choose a type...</option>
                      <option>Full Time</option>
                      <option>Part Time</option>
                      <option>Contract</option>
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Phone (optional)</span>
                  <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. +1 555 555 5555" />
                </label>

                <div className="pt-4">
                  <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-full font-semibold shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all">
                    {loading ? 'Posting...' : 'Submit job'}
                  </button>
                </div>
              </form>
            </div>

            {/* Right - Visual / Tips */}
            <aside className="hidden lg:block bg-gradient-to-b from-gray-50 to-white p-8 border-l border-gray-100">
              <div className="sticky top-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Tips for a great listing</h3>
                <ul className="space-y-3 text-gray-700">
                  <li>Be specific about hours and pay range.</li>
                  <li>Include required experience and any certifications.</li>
                  <li>Mention if the role is suitable for entry-level applicants.</li>
                  <li>We manually review each posting to keep the site scam-free.</li>
                </ul>

                <div className="mt-6 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                  <div className="text-xs text-gray-500">Preview</div>
                  <div className="mt-3">
                    <div className="text-sm font-semibold text-gray-900">{form.jobTitle || 'Job title preview'}</div>
                    <div className="text-xs text-gray-500 mt-1">{form.company || 'Company name'}</div>
                    <div className="mt-3 text-sm text-gray-700 line-clamp-3">{form.description || 'A short preview of the job description will appear here.'}</div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
