import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL('https://yidjobs.com'),
  title: {
    default: "Yid Jobs - Jewish Jobs in Boro Park | Yiddish Employment Opportunities",
    template: "%s | Yid Jobs - Jewish Jobs in Boro Park"
  },
  description: "Find Jewish jobs in Boro Park. The largest Yiddish jobs website serving the Orthodox Jewish community. Thousands of kosher job opportunities in retail, healthcare, education, office work and more. Post and find jobs in the Jewish community today.",
  keywords: [
    "Jewish jobs",
    "Yiddish jobs", 
    "Boro Park jobs",
    "Orthodox Jewish jobs",
    "kosher jobs",
    "Yid jobs",
    "frum jobs",
    "Jewish community jobs",
    "Boro Park employment",
    "Boro Park Jewish community",
    "Jewish job board",
    "Yiddish employment",
    "Orthodox community jobs",
    "Jewish career opportunities",
    "Shomer Shabbos jobs",
    "kosher workplace",
    "Jewish retail jobs Boro Park",
    "Jewish healthcare jobs Boro Park",
    "Jewish education jobs Boro Park",
    "Jewish office jobs Boro Park"
  ],
  authors: [{ name: "Yid Jobs" }],
  creator: "Yid Jobs",
  publisher: "Yid Jobs",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/app/favico.png",
    shortcut: "/app/favico.png",
    apple: "/app/favico.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yidjobs.com",
    siteName: "Yid Jobs - Jewish Jobs in Boro Park",
    title: "Yid Jobs - Find Jewish Jobs in Boro Park | Yiddish Employment",
    description: "The largest Jewish job board for Boro Park. Find kosher job opportunities in the Orthodox Jewish community. Browse thousands of Yiddish jobs in retail, healthcare, education and more.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Yid Jobs - Jewish Jobs in Boro Park"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Yid Jobs - Jewish Jobs in Boro Park",
    description: "Find kosher job opportunities in the Orthodox Jewish community. The largest Yiddish job board for Boro Park.",
    images: ["/og-image.png"],
    creator: "@yidjobs"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  alternates: {
    canonical: "https://yidjobs.com",
  },
  category: "employment",
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Yid Jobs",
    "alternateName": "Yiddish Jobs Boro Park",
    "url": "https://yidjobs.com",
    "description": "The largest Jewish job board serving Boro Park and the Orthodox Jewish community",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://yidjobs.com/jobs?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Yid Jobs",
      "url": "https://yidjobs.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://yidjobs.com/favico.png"
      },
      "sameAs": [
        "https://www.facebook.com/yidjobs",
        "https://twitter.com/yidjobs"
      ],
      "areaServed": {
        "@type": "Place",
        "name": "Boro Park",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Boro Park",
          "addressRegion": "NY",
          "addressCountry": "US"
        }
      },
      "knowsAbout": [
        "Jewish Employment",
        "Yiddish Jobs",
        "Orthodox Jewish Community",
        "Boro Park",
        "Kosher Workplace"
      ]
    }
  };

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Preconnect to external resources for faster loading */}
        <link rel="preconnect" href="https://cdn.prod.website-files.com" />
        <link rel="dns-prefetch" href="https://cdn.prod.website-files.com" />
        {/* Preload the app layout font with correct attributes to avoid preload warnings */}
        <link
          rel="preload"
          href="/app/_next/static/media/e4af272ccee01ff0-s.p.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
