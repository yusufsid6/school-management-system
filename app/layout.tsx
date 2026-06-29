import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/app/context/AuthContext';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'School Management System',
  description: 'Complete school management system with student, teacher, and admin dashboards',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.className}>
      <body className="bg-gray-100">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
