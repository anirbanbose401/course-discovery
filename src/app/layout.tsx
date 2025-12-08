import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Toast from '@/components/ui/Toast';
import { ToastProvider } from '@/context/ToastContext';
import { ComparisonProvider } from '@/context/ComparisonContext';
import { FavoritesProvider } from '@/context/FavoritesContext';

export const metadata: Metadata = {
  title: 'CourseHub - Discover Your Next Skill',
  description: 'Browse and enroll in high-quality courses across multiple disciplines. Learn from expert instructors and build your skills.',
  keywords: 'courses, online learning, education, skills, training',
  openGraph: {
    title: 'CourseHub - Discover Your Next Skill',
    description: 'Browse and enroll in high-quality courses across multiple disciplines.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col">
        <ToastProvider>
          <ComparisonProvider>
            <FavoritesProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <Toast />
            </FavoritesProvider>
          </ComparisonProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
