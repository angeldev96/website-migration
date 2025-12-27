'use client';

import React from 'react';
import { Mail, ShieldCheck, Zap, Info, MessageSquare, Building2, Linkedin, ExternalLink } from 'lucide-react';

export default function PostJobPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-600 to-blue-700 p-8 lg:p-12 text-white text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Post a Job on Yiddish Jobs</h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              We&apos;ve simplified our process. Choose the method that best fits your hiring needs.
            </p>
          </div>

          <div className="p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Left Column: Standard Flow */}
              <div className="flex-1 space-y-12">
                {/* Step by Step Section */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Zap className="text-blue-600 w-6 h-6" />
                    Standard Posting Flow
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col items-center text-center p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white mb-3 shadow-md">
                        <Mail className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm mb-1">1. Send Email</h3>
                      <p className="text-xs text-gray-600">jobs@yiddishjobs.com</p>
                    </div>

                    <div className="flex flex-col items-center text-center p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white mb-3 shadow-md">
                        <Zap className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm mb-1">2. AI Processing</h3>
                      <p className="text-xs text-gray-600">Automatic extraction</p>
                    </div>

                    <div className="flex flex-col items-center text-center p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white mb-3 shadow-md">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm mb-1">3. Review</h3>
                      <p className="text-xs text-gray-600">Manual verification</p>
                    </div>
                  </div>
                </div>

                {/* Detailed Instructions */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Info className="text-blue-600 w-6 h-6" />
                    Posting Guidelines
                  </h2>
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <div className="mt-1 bg-blue-100 rounded-full p-1 h-fit">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Weekly Quota</p>
                          <p className="text-gray-600 text-sm">Each entity is allowed to post up to <span className="font-bold text-gray-900">2 jobs per week</span> for free.</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="mt-1 bg-blue-100 rounded-full p-1 h-fit">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Approval Process</p>
                          <p className="text-gray-600 text-sm">Once submitted, your job will be marked as <span className="font-bold text-orange-600">PENDING</span> until reviewed.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </section>

                <div className="bg-blue-600 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold">Ready to hire?</h3>
                    <p className="text-blue-100 text-sm">Send an email with the job details.</p>
                  </div>
                  <a 
                    href="mailto:jobs@yiddishjobs.com" 
                    className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    Send Job Email
                  </a>
                </div>
              </div>

              {/* Right Column: Corporate Portal */}
              <div className="lg:w-80 xl:w-96 shrink-0">
                <div className="bg-linear-to-br from-gray-900 to-blue-900 rounded-3xl p-6 md:p-8 text-white h-full relative overflow-hidden shadow-2xl border border-gray-800">
                  {/* Decorative background element */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium mb-6 border border-blue-500/30 w-fit">
                      <Building2 className="w-3.5 h-3.5" />
                      High-Volume Hiring
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-4">Corporate Portal</h2>
                    <p className="text-blue-100 text-sm mb-8 leading-relaxed">
                      Are you a large corporation or agency? Request access to our <strong>Exclusive Employer Portal</strong>.
                    </p>
                    
                    <div className="space-y-4 mb-10">
                      <div className="flex items-center gap-3 text-blue-100 text-sm bg-white/5 p-3 rounded-xl border border-white/10">
                        <Zap className="w-5 h-5 text-blue-400 shrink-0" />
                        <span>Instant Posting</span>
                      </div>
                      <div className="flex items-center gap-3 text-blue-100 text-sm bg-white/5 p-3 rounded-xl border border-white/10">
                        <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
                        <span>No Approval Required</span>
                      </div>
                    </div>

                    <div className="mt-auto space-y-3">
                      <p className="text-xs text-blue-200 font-medium mb-2">Request access via:</p>
                      <a 
                        href="https://www.linkedin.com/in/yossi-rosenfeld-874842289/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-[#0077b5] hover:bg-[#006396] text-white px-4 py-3 rounded-xl font-bold transition-all text-sm shadow-lg"
                      >
                        <Linkedin className="w-5 h-5" />
                        LinkedIn Message
                      </a>
                      <a 
                        href="mailto:admin@yiddishjobs.com?subject=Corporate Portal Access Request"
                        className="flex items-center justify-center gap-2 bg-white text-gray-900 hover:bg-gray-100 px-4 py-3 rounded-xl font-bold transition-all text-sm shadow-lg"
                      >
                        <Mail className="w-5 h-5 text-blue-600" />
                        Email Admin
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="bg-gray-50 p-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Questions? Contact us at admin@yiddishjobs.com
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

