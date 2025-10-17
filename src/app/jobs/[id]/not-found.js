import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-8xl mb-4">😕</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, we couldn&apos;t find the job you&apos;re looking for. It may have been filled or removed.
          </p>
        </div>
        
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Browse All Jobs
          </Link>
          <Link
            href="/"
            className="block w-full bg-white text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold border border-gray-300"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
