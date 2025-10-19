import React, { Suspense } from 'react';
import JobsClient from './JobsClient';

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading jobs...</div>}>
      <JobsClient />
    </Suspense>
  );
}
