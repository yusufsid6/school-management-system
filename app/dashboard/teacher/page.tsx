'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import DashboardLayout from '@/app/components/DashboardLayout';
import StatCard from '@/app/components/StatCard';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { createClient } from '@/lib/supabase/client';
import { Users, BookOpen, BarChart3, FileText } from 'lucide-react';

export default function TeacherDashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({
    students: 0,
    classes: 0,
    assignments: 0,
    pendingGrades: 0,
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

        const { data: classesData } = await supabase
          .from('classes')
          .select('id')
          .eq('teacher_id', authUser.id);

        const classIds = classesData?.map((c) => c.id) || [];

        const { data: studentsData } = await supabase
          .from('students_classes')
          .select('student_id')
          .in('class_id', classIds);

        const { data: assignmentsData } = await supabase
          .from('assignments')
          .select('id')
          .in('class_id', classIds);

        setStats({
          students: new Set(studentsData?.map((s) => s.student_id)).size,
          classes: classesData?.length || 0,
          assignments: assignmentsData?.length || 0,
          pendingGrades: 0,
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
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your classes and students</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Students"
            value={stats.students}
            icon={<Users size={32} />}
            bgColor="bg-blue-50"
            textColor="text-blue-600"
          />
          <StatCard
            label="Classes"
            value={stats.classes}
            icon={<BookOpen size={32} />}
            bgColor="bg-purple-50"
            textColor="text-purple-600"
          />
          <StatCard
            label="Assignments"
            value={stats.assignments}
            icon={<FileText size={32} />}
            bgColor="bg-green-50"
            textColor="text-green-600"
          />
          <StatCard
            label="Pending Grades"
            value={stats.pendingGrades}
            icon={<BarChart3 size={32} />}
            bgColor="bg-orange-50"
            textColor="text-orange-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg font-medium text-gray-700">
                ➕ Create Assignment
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg font-medium text-gray-700">
                📋 Mark Attendance
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg font-medium text-gray-700">
                📊 Enter Grades
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg font-medium text-gray-700">
                📈 View Reports
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 border border-gray-200 rounded-lg">
                  <p className="font-medium text-gray-900">Assignment submitted by student</p>
                  <p className="text-sm text-gray-500">{new Date(Date.now() - i * 3600000).toLocaleTimeString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}