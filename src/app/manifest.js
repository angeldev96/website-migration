export default function manifest() {
  return {
    name: 'Yiddish Jobs - Jewish Jobs in Boro Park',
    short_name: 'Yiddish Jobs',
    description: 'Find Jewish jobs in Boro Park. The largest Yiddish jobs website serving the Orthodox Jewish community.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    orientation: 'portrait',
    icons: [
      {
        src: '/favico.png',
        sizes: '32x32',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['business', 'employment', 'productivity'],
    lang: 'en-US',
    dir: 'ltr',
  };
}
