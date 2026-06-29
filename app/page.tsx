'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { useRole } from '@/app/hooks/useRole';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { role } = useRole();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Redirect to appropriate dashboard based on role
        switch (role) {
          case 'student':
            router.push('/dashboard/student');
            break;
          case 'teacher':
            router.push('/dashboard/teacher');
            break;
          case 'admin':
            router.push('/dashboard/admin');
            break;
          default:
            router.push('/auth/login');
        }
      } else {
        router.push('/auth/login');
      }
    }
  }, [loading, user, role, router]);

  return <LoadingSpinner />;
}
