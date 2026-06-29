'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/hooks/useAuth';

export default function StudentAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!user) return;

      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) return;

        // Get student's classes
        const { data: enrollments } = await supabase
          .from('students_classes')
          .select('class_id')
          .eq('student_id', authUser.id);

        const classIds = enrollments?.map((e) => e.class_id) || [];

        if (classIds.length === 0) {
          setAssignments([]);
          setLoading(false);
          return;
        }

        // Get assignments for these classes
        const { data, error } = await supabase
          .from('assignments')
          .select('*')
          .in('class_id', classIds)
          .order('due_date', { ascending: true });

        if (error) throw error;
        setAssignments(data || []);
      } catch (error) {
        console.error('[v0] Error fetching assignments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  const getStatusColor = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    if (due < now) return 'bg-red-100 text-red-800';
    if (due.getTime() - now.getTime() < 86400000) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    if (due < now) return 'Overdue';
    if (due.getTime() - now.getTime() < 86400000) return 'Due Soon';
    return 'In Progress';
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600 mt-1">Your class assignments and submissions</p>
        </div>

        <div className="grid gap-6">
          {assignments.length > 0 ? (
            assignments.map((assignment) => (
              <div key={assignment.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{assignment.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{assignment.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.due_date)}`}>
                    {getStatusText(assignment.due_date)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Due: {new Date(assignment.due_date).toLocaleDateString()}
                  </p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                    Submit Assignment
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 text-lg">No assignments available</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
