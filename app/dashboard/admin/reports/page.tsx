'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { createClient } from '@/lib/supabase/client';

export default function AdminReports() {
  const [reports, setReports] = useState({
    totalUsers: 0,
    activeStudents: 0,
    averageAttendance: 0,
    totalSubmissions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const supabase = createClient();

        // Total users
        const { data: usersData } = await supabase
          .from('profiles')
          .select('id');

        // Active students
        const { data: studentsData } = await supabase
          .from('students_classes')
          .select('id', { distinct: true });

        // Average attendance
        const { data: attendanceData } = await supabase
          .from('attendance')
          .select('status');

        const presentCount = attendanceData?.filter((a) => a.status === 'present').length || 0;
        const totalCount = attendanceData?.length || 1;
        const avgAttendance = Math.round((presentCount / totalCount) * 100);

        // Total submissions
        const { data: submissionsData } = await supabase
          .from('assignment_submissions')
          .select('id');

        setReports({
          totalUsers: usersData?.length || 0,
          activeStudents: studentsData?.length || 0,
          averageAttendance: avgAttendance,
          totalSubmissions: submissionsData?.length || 0,
        });
      } catch (error) {
        console.error('[v0] Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">System-wide statistics and reports</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Total Users</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{reports.totalUsers}</p>
            <p className="text-gray-500 text-xs mt-2">Registered in system</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Active Students</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{reports.activeStudents}</p>
            <p className="text-gray-500 text-xs mt-2">Enrolled in classes</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Avg Attendance</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{reports.averageAttendance}%</p>
            <p className="text-gray-500 text-xs mt-2">Overall attendance rate</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-medium">Submissions</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{reports.totalSubmissions}</p>
            <p className="text-gray-500 text-xs mt-2">Total assignments submitted</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Key Metrics</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex justify-between">
                  <span>Total System Users:</span>
                  <span className="font-medium text-gray-900">{reports.totalUsers}</span>
                </li>
                <li className="flex justify-between">
                  <span>Active Enrollments:</span>
                  <span className="font-medium text-gray-900">{reports.activeStudents}</span>
                </li>
                <li className="flex justify-between">
                  <span>Assignment Submissions:</span>
                  <span className="font-medium text-gray-900">{reports.totalSubmissions}</span>
                </li>
                <li className="flex justify-between">
                  <span>System Attendance Rate:</span>
                  <span className="font-medium text-gray-900">{reports.averageAttendance}%</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg font-medium text-blue-600">
                  Export All Reports
                </button>
                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg font-medium text-blue-600">
                  Generate Attendance Report
                </button>
                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg font-medium text-blue-600">
                  Generate Grade Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
