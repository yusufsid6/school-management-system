'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/hooks/useAuth';

export default function StudentGrades() {
  const { user } = useAuth();
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      if (!user) return;

      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) return;

        const { data, error } = await supabase
          .from('grades')
          .select('*')
          .eq('student_id', authUser.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setGrades(data || []);
      } catch (error) {
        console.error('[v0] Error fetching grades:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'text-green-600 bg-green-50';
      case 'B':
        return 'text-blue-600 bg-blue-50';
      case 'C':
        return 'text-yellow-600 bg-yellow-50';
      case 'D':
        return 'text-orange-600 bg-orange-50';
      case 'F':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Grades</h1>
          <p className="text-gray-600 mt-1">Your academic grades and performance</p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Subject</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Term</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Marks</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Grade</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Comments</th>
                </tr>
              </thead>
              <tbody>
                {grades.length > 0 ? (
                  grades.map((grade) => (
                    <tr key={grade.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{grade.subject}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{grade.term}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {grade.marks_obtained}/{grade.total_marks}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full font-semibold ${getGradeColor(grade.grade)}`}>
                          {grade.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{grade.comments || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No grades available yet
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
