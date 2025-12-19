'use client';

import React from 'react';
import { Mail, ShieldCheck, Zap, Info, MessageSquare } from 'lucide-react';

export default function PostJobPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-600 to-blue-700 p-8 lg:p-12 text-white text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Post a Job on Yid Jobs</h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              We&apos;ve simplified our process. Now you can post jobs directly via email using our AI-powered system.
            </p>
          </div>

          <div className="p-8 lg:p-12">
            {/* Step by Step Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white mb-4 shadow-lg">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">1. Send Email</h3>
                <p className="text-sm text-gray-600">Send your job details to <span className="font-semibold text-blue-600">jobs@yidjobs.com</span></p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white mb-4 shadow-lg">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">2. AI Processing</h3>
                <p className="text-sm text-gray-600">Our AI extracts the title, category, and description automatically.</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white mb-4 shadow-lg">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">3. Manual Review</h3>
                <p className="text-sm text-gray-600">Every post is reviewed by our team before going live.</p>
              </div>
            </div>

            {/* Detailed Instructions */}
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Info className="text-blue-600 w-6 h-6" />
                  Posting Guidelines for Entities
                </h2>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <div className="mt-1 bg-blue-100 rounded-full p-1 h-fit">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Weekly Quota</p>
                        <p className="text-gray-600">Each entity is allowed to post up to <span className="font-bold text-gray-900">2 jobs per week</span> for free.</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="mt-1 bg-blue-100 rounded-full p-1 h-fit">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Need to post more?</p>
                        <p className="text-gray-600">If you need to exceed the weekly limit, please contact our administrator at <span className="font-semibold text-blue-600">admin@yidjobs.com</span> to request a quota increase.</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="mt-1 bg-blue-100 rounded-full p-1 h-fit">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Approval Process</p>
                        <p className="text-gray-600">Once submitted, your job will be marked as <span className="font-bold text-orange-600">PENDING</span>. You will receive a confirmation email once it is approved and live on the site.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </section>

              <div className="bg-blue-600 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Ready to hire?</h3>
                  <p className="text-blue-100">Just send an email with the job details and we&apos;ll handle the rest.</p>
                </div>
                <a 
                  href="mailto:jobs@yidjobs.com" 
                  className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Send Job Email
                </a>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="bg-gray-50 p-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Questions? Contact us at admin@yidjobs.com
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

