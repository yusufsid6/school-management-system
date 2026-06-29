'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/hooks/useAuth';

export default function TeacherStudents() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!user) return;

      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) return;

        // Get teacher's classes
        const { data: classesData } = await supabase
          .from('classes')
          .select('id')
          .eq('teacher_id', authUser.id);

        const classIds = classesData?.map((c) => c.id) || [];

        if (classIds.length === 0) {
          setStudents([]);
          setLoading(false);
          return;
        }

        // Get students in these classes
        const { data: enrollmentsData } = await supabase
          .from('students_classes')
          .select('student_id')
          .in('class_id', classIds);

        const studentIds = enrollmentsData?.map((e) => e.student_id) || [];

        if (studentIds.length === 0) {
          setStudents([]);
          setLoading(false);
          return;
        }

        // Get student profiles
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('*')
          .in('id', studentIds);

        setStudents(profilesData || []);
      } catch (error) {
        console.error('[v0] Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Students</h1>
          <p className="text-gray-600 mt-1">Manage and view your class students</p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {student.first_name} {student.last_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{student.phone || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm">
                        <button className="text-blue-600 hover:text-blue-800 font-medium">View Profile</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
