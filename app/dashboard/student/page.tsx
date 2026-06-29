'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import DashboardLayout from '@/app/components/DashboardLayout';
import StatCard from '@/app/components/StatCard';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { createClient } from '@/lib/supabase/client';
import { Bell, BookOpen, Calendar, BarChart3 } from 'lucide-react';

export default function StudentDashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({
    attendance: 85,
    assignments: 4,
    grades: 'A',
    unreadNotifications: 2,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) return;

        const { data: attendanceData } = await supabase
          .from('attendance')
          .select('status')
          .eq('student_id', authUser.id);

        const presentCount = attendanceData?.filter(
          (a) => a.status === 'present'
        ).length || 0;
        const totalCount = attendanceData?.length || 1;
        const attendancePercentage = Math.round((presentCount / totalCount) * 100);

        const { data: assignmentsData } = await supabase
          .from('assignments')
          .select('id')
          .gte('due_date', new Date().toISOString());

        const { data: gradesData } = await supabase
          .from('grades')
          .select('grade')
          .eq('student_id', authUser.id)
          .order('created_at', { ascending: false })
          .limit(1);

        const { data: notificationsData } = await supabase
          .from('notifications')
          .select('id')
          .eq('user_id', authUser.id)
          .eq('read', false);

        setStats({
          attendance: attendancePercentage,
          assignments: assignmentsData?.length || 0,
          grades: gradesData?.[0]?.grade || 'N/A',
          unreadNotifications: notificationsData?.length || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchStats();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (loading || isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600 mt-1">Here's an overview of your academic progress</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Attendance"
            value={`${stats.attendance}%`}
            icon={<Calendar size={32} />}
            bgColor="bg-blue-50"
            textColor="text-blue-600"
          />
          <StatCard
            label="Assignments"
            value={stats.assignments}
            icon={<BookOpen size={32} />}
            bgColor="bg-purple-50"
            textColor="text-purple-600"
          />
          <StatCard
            label="Current Grade"
            value={stats.grades}
            icon={<BarChart3 size={32} />}
            bgColor="bg-green-50"
            textColor="text-green-600"
          />
          <StatCard
            label="Notifications"
            value={stats.unreadNotifications}
            icon={<Bell size={32} />}
            bgColor="bg-orange-50"
            textColor="text-orange-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Assignments</h2>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">Mathematics Assignment {i}</p>
                    <p className="text-sm text-gray-500">Due: {new Date(Date.now() + i * 86400000).toLocaleDateString()}</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h2>
            <div className="space-y-2">
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg font-medium text-gray-700">
                📅 View Timetable
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg font-medium text-gray-700">
                📊 View Grades
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg font-medium text-gray-700">
                📝 Submit Assignment
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}