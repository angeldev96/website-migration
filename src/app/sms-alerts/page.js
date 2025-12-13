'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SMSAlertsPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    jobTypes: [],
    industries: '',
    preferredTimes: [],
    employmentStatus: '',
    contactMethod: '',
    urgency: '3',
    frequency: '',
    consent: false,
    finalConsent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'jobTypes' || name === 'preferredTimes') {
        setFormData(prev => ({
          ...prev,
          [name]: checked 
            ? [...prev[name], value]
            : prev[name].filter(item => item !== value)
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.consent || !formData.finalConsent) {
      alert('Please accept both consent agreements to continue.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          jobTypes: [],
          industries: '',
          preferredTimes: [],
          employmentStatus: '',
          contactMethod: '',
          urgency: '3',
          frequency: '',
          consent: false,
          finalConsent: false
        });
        setShowSuccess(false);
      }, 5000);
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center animate-fade-in">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">You're All Set! 🎉</h2>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for signing up for SMS job alerts. You'll start receiving personalized job notifications based on your preferences.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <p className="text-sm text-gray-700 mb-2">
                <strong>What's Next?</strong>
              </p>
              <ul className="text-left text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>You'll receive a confirmation text shortly</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Reply HELP for assistance or STOP to opt-out anytime</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Job alerts will be sent based on your preferences</span>
                </li>
              </ul>
            </div>
            <Link 
              href="/jobs" 
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Browse Jobs Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block bg-blue-100 rounded-full p-3 mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            SMS Job Alerts
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get instant notifications about the latest Yiddish job opportunities directly to your phone. 
            Stay ahead of the competition with real-time alerts.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 md:p-12 animate-fade-in-up">
          {/* Disclaimer */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded-r-lg">
            <p className="text-sm text-gray-700 leading-relaxed">
              By completing this form, you give express written consent to receive recurring text messages from YiddishJobs 
              at the phone number provided. <strong>Message content:</strong> Job alerts, contact information for job opportunities, 
              and service updates. <strong>Frequency:</strong> Varies based on matching job opportunities. Message and data rates may apply. 
              Reply <strong>HELP</strong> for help or <strong>STOP</strong> to opt-out at any time. Consent is not a condition of employment. 
              Your information will be kept confidential and will not be shared with third parties except as needed to deliver requested job alerts.
            </p>
          </div>

          {/* Personal Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
              Personal Information
            </h3>
            
            <div className="space-y-5">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
          </div>

          {/* Consent Agreement 1 */}
          <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleInputChange}
                required
                className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700 leading-relaxed">
                <span className="text-red-500">*</span> I agree to receive recurring SMS messages from YiddishJobs at the number provided. 
                I understand that message and data rates may apply, that I can reply <strong>STOP</strong> to opt-out at any time, 
                and <strong>HELP</strong> for help. I understand that consent is not a condition of employment.
              </span>
            </label>
          </div>

          {/* Job Preferences */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
              Job Preferences
            </h3>

            <div className="space-y-6">
              {/* Job Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What types of job alerts are you most interested in receiving?
                </label>
                <div className="space-y-3">
                  {[
                    'Full-time positions',
                    'Part-time positions',
                    'Temporary/Contract roles',
                    'Entry-level jobs',
                    'Management positions'
                  ].map((type) => (
                    <label key={type} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        name="jobTypes"
                        value={type}
                        checked={formData.jobTypes.includes(type)}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Specific Industry */}
              <div>
                <label htmlFor="industries" className="block text-sm font-medium text-gray-700 mb-2">
                  If you selected 'Specific industry/field', please specify:
                </label>
                <input
                  type="text"
                  id="industries"
                  name="industries"
                  value={formData.industries}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., Healthcare, Technology, Education"
                />
              </div>

              {/* Preferred Times */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Would you prefer to receive job alerts at specific times of the day?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Morning (9 AM - 12 PM)',
                    'Afternoon (12 PM - 5 PM)',
                    'Evening (5 PM - 9 PM)',
                    'Anytime'
                  ].map((time) => (
                    <label key={time} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        name="preferredTimes"
                        value={time}
                        checked={formData.preferredTimes.includes(time)}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors">{time}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">3</span>
              Additional Information
            </h3>

            <div className="space-y-6">
              {/* Employment Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Which of the following best describes your current employment status?
                </label>
                <div className="space-y-3">
                  {[
                    'Unemployed and actively seeking new opportunities',
                    'Employed and looking for a new job',
                    'Employed and passively open to new opportunities',
                    'Student'
                  ].map((status) => (
                    <label key={status} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="employmentStatus"
                        value={status}
                        checked={formData.employmentStatus === status}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Contact Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What is your preferred method of contact for follow-up regarding job opportunities?
                </label>
                <div className="space-y-3">
                  {['Text message', 'Email', 'Phone call'].map((method) => (
                    <label key={method} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="contactMethod"
                        value={method}
                        checked={formData.contactMethod === method}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Urgency Scale */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  On a scale of 1-5, how urgent is your job search?
                </label>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 w-24">Not urgent</span>
                  <div className="flex-1 flex justify-between items-center">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <label key={num} className="flex flex-col items-center cursor-pointer group">
                        <input
                          type="radio"
                          name="urgency"
                          value={num.toString()}
                          checked={formData.urgency === num.toString()}
                          onChange={handleInputChange}
                          className="w-6 h-6 text-blue-600 border-gray-300 focus:ring-blue-500 mb-2"
                        />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{num}</span>
                      </label>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 w-24 text-right">Very urgent</span>
                </div>
              </div>

              {/* Frequency */}
              <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
                  How often would you like to receive job alerts?
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select frequency</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="as-available">As soon as jobs become available</option>
                </select>
              </div>
            </div>
          </div>

          {/* Final Consent */}
          <div className="mb-8 bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                name="finalConsent"
                checked={formData.finalConsent}
                onChange={handleInputChange}
                required
                className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700 leading-relaxed">
                <span className="text-red-500">*</span> By clicking this checkbox, I give express written consent to receive recurring 
                text messages from YiddishJobs at the phone number I provided. Message content may include job alerts, 
                contact information for job opportunities, and service updates. Frequency will vary based on matching job opportunities. 
                Message and data rates may apply. I understand I can reply <strong>HELP</strong> for help or <strong>STOP</strong> to opt out at any time. 
                Consent is not a condition of employment. My information will be kept confidential and will not be shared with third parties 
                except as needed to deliver requested job alerts.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Sign Up for SMS Alerts'
              )}
            </button>
            <Link
              href="/jobs"
              className="sm:w-auto px-8 py-4 border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all font-semibold text-center"
            >
              Browse Jobs Instead
            </Link>
          </div>
        </form>

        {/* Benefits Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              title: 'Instant Notifications',
              description: 'Be the first to know when relevant jobs are posted'
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              ),
              title: 'Personalized Matches',
              description: 'Only receive alerts for jobs that match your preferences'
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ),
              title: 'Your Privacy Protected',
              description: 'Your information is secure and never shared with third parties'
            }
          ].map((benefit, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 text-center animate-fade-in-up" style={{ animationDelay: `${(index + 1) * 200}ms` }}>
              <div className="inline-block bg-blue-100 rounded-full p-3 mb-4 text-blue-600">
                {benefit.icon}
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
