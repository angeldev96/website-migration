export const metadata = {
  title: 'About Us - Yiddish Jobs',
  description: 'About Yiddish Jobs — mission, values and how we keep the site scam-free and community-focused.'
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md border border-gray-200 p-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">About Yiddish Jobs</h1>

          <p className="text-gray-700 mb-4 leading-relaxed">
            Welcome to Yiddish Jobs, the place where job seekers from the Yiddish-speaking and Jewish communities find honest, fresh, and scam-free job opportunities.
          </p>

          <p className="text-gray-700 mb-4 leading-relaxed">
            We know how hard it can be to find real jobs online — especially ones that are trustworthy and relevant to your background, language, and culture. That is why we created Yiddish Jobs, a simple, free-to-use platform where you can find the latest openings without needing to sign up or log in. No accounts. No spam. Just real jobs, updated daily.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">What you can find here</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><strong>Macher jobs</strong> – for go-getters and doers looking to make things happen</li>
            <li><strong>Yiddish jobs</strong> – roles tailored for members of the Yiddish-speaking and Jewish communities</li>
            <li><strong>Macher USA</strong> – from local gigs to nationwide positions</li>
          </ul>

          <p className="text-gray-700 mt-6 leading-relaxed">
            Every job posted on our site is manually checked to make sure it is legitimate and scam-free. We value your safety and privacy, which is why we do not allow direct calls or emails on job detail pages. Instead, we guide you to apply through proper, trusted channels.
          </p>

          <p className="text-gray-700 mt-4 leading-relaxed">
            Whether you are looking for part-time work, full-time careers, or remote gigs, we are here to make your search easier, safer, and more community-focused.
          </p>

          <p className="text-gray-700 mt-6 leading-relaxed">
            At Yiddish Jobs, we are proud to support your journey with opportunities that are as real as you are. Join thousands of job seekers who trust us to help them find the next step in their careers — with heart, honesty, and a focus on Yiddish jobs that truly matter.
          </p>
        </div>
      </div>
    </main>
  );
}
