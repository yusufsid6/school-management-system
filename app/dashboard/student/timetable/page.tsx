'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/hooks/useAuth';

export default function StudentTimetable() {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimetable = async () => {
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
          setTimetable([]);
          setLoading(false);
          return;
        }

        // Get timetable for these classes
        const { data, error } = await supabase
          .from('timetable')
          .select('*')
          .in('class_id', classIds)
          .order('day_of_week', { ascending: true });

        if (error) throw error;
        setTimetable(data || []);
      } catch (error) {
        console.error('[v0] Error fetching timetable:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const groupedTimetable = days.reduce((acc, day) => {
    acc[day] = timetable.filter((t) => t.day_of_week === day);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Timetable</h1>
          <p className="text-gray-600 mt-1">Your weekly class schedule</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {days.map((day) => (
            <div key={day} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{day}</h3>
              <div className="space-y-3">
                {groupedTimetable[day].length > 0 ? (
                  groupedTimetable[day].map((session) => (
                    <div key={session.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="font-semibold text-gray-900">{session.subject}</p>
                      <p className="text-sm text-gray-600">
                        {session.start_time} - {session.end_time}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No classes</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
