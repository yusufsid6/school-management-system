'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import DashboardLayout from '@/app/components/DashboardLayout';
import StatCard from '@/app/components/StatCard';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { createClient } from '@/lib/supabase/client';
import { Users, BookOpen, BarChart3, Settings } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalAssignments: 0,
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

        const { data: studentsData } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'student');

        const { data: teachersData } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'teacher');

        const { data: classesData } = await supabase
          .from('classes')
          .select('id');

        const { data: assignmentsData } = await supabase
          .from('assignments')
          .select('id');

        setStats({
          totalStudents: studentsData?.length || 0,
          totalTeachers: teachersData?.length || 0,
          totalClasses: classesData?.length || 0,
          totalAssignments: assignmentsData?.length || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage the entire school system</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Students"
            value={stats.totalStudents}
            icon={<Users size={32} />}
            bgColor="bg-blue-50"
            textColor="text-blue-600"
          />
          <StatCard
            label="Total Teachers"
            value={stats.totalTeachers}
            icon={<Users size={32} />}
            bgColor="bg-purple-50"
            textColor="text-purple-600"
          />
          <StatCard
            label="Total Classes"
            value={stats.totalClasses}
            icon={<BookOpen size={32} />}
            bgColor="bg-green-50"
            textColor="text-green-600"
          />
          <StatCard
            label="Total Assignments"
            value={stats.totalAssignments}
            icon={<BarChart3 size={32} />}
            bgColor="bg-orange-50"
            textColor="text-orange-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">System Management</h2>
            <div className="space-y-2">
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg font-medium text-gray-700 flex items-center gap-2">
                <Users className="w-5 h-5" /> Manage Users
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg font-medium text-gray-700 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Manage Classes
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg font-medium text-gray-700 flex items-center gap-2">
                <Settings className="w-5 h-5" /> System Settings
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg font-medium text-gray-700 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" /> View Reports
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Students per Teacher</span>
                <span className="font-bold text-gray-900">
                  {stats.totalTeachers > 0 ? (stats.totalStudents / stats.totalTeachers).toFixed(1) : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Class Size</span>
                <span className="font-bold text-gray-900">
                  {stats.totalClasses > 0 ? (stats.totalStudents / stats.totalClasses).toFixed(1) : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Assignments Created</span>
                <span className="font-bold text-gray-900">{stats.totalAssignments}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}