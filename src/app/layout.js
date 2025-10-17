import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Yiddish Jobs - Find Your Perfect Yiddish Job",
  description: "Discover thousands of yiddish opportunities and yid job positions from our extensive professional database. Connect with ambitious career opportunities today.",
  icons: {
    icon: "/favico.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
