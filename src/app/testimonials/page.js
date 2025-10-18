import TestimonialCard from '@/components/TestimonialCard';

export const metadata = {
  title: 'Testimonials - Yiddish Jobs',
  description: 'What our users are saying about Yiddish Jobs.'
};

const TESTIMONIALS = [
  {
    quote: 'I always thought you had to know someone to get a good job. This site proves you can become a macher without protekzia. It\'s straightforward, respectful, and built for us.',
    name: 'Shmuli Lustigman',
    location: 'Boro Park',
  },
  {
    quote: 'Other job boards felt like they didn\'t get us. Here, I felt like I was already in the room. The jobs are real, the people are respectful, and now I\'m on track to becoming an influencer in my industry.',
    name: 'Shlomy Katz',
    location: 'Boro Park',
  },
  {
    quote: 'I thought I\'d be stuck in dead-end warehouse jobs forever. Yiddish Jobs showed me that even someone like me can become a macher if you find the right fit.',
    name: 'Yehudah Lev',
    location: 'Boro Park',
  },
  {
    quote: 'Fast, honest listings and no spam — exactly what our community needed.',
    name: 'Rivka Stern',
    location: 'Boro Park',
  },
  {
    quote: 'I found a steady part-time job that lets me care for my family and still earn a decent wage. Thank you!',
    name: 'Moshe Green',
    location: 'Boro Park',
  },
  {
    quote: 'Great platform — real people, real jobs. Highly recommend.',
    name: 'Leah Katz',
    location: 'Boro Park',
  }
];

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-block bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-4">Testimonials</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">What our great hotshots are saying</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <TestimonialCard key={idx} {...t} />
          ))}
        </div>
      </div>
    </main>
  );
}
