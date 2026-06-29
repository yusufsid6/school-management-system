'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/hooks/useAuth';

export default function TeacherAttendance() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!user) return;

      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) return;

        const { data: classesData } = await supabase
          .from('classes')
          .select('*')
          .eq('teacher_id', authUser.id);

        setClasses(classesData || []);
        if (classesData && classesData.length > 0) {
          setSelectedClass(classesData[0].id);
        }
      } catch (error) {
        console.error('[v0] Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [user]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) return;

      try {
        const supabase = createClient();

        // Get students in selected class
        const { data: enrollmentsData } = await supabase
          .from('students_classes')
          .select('student_id')
          .eq('class_id', selectedClass);

        const studentIds = enrollmentsData?.map((e) => e.student_id) || [];

        if (studentIds.length === 0) {
          setStudents([]);
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
      }
    };

    fetchStudents();
  }, [selectedClass]);

  const handleAttendanceChange = (studentId: string, status: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSubmit = async () => {
    try {
      const supabase = createClient();
      const today = new Date().toISOString().split('T')[0];

      const attendanceRecords = Object.entries(attendance).map(([studentId, status]) => ({
        student_id: studentId,
        class_id: selectedClass,
        date: today,
        status,
      }));

      const { error } = await supabase
        .from('attendance')
        .upsert(attendanceRecords);

      if (error) throw error;
      alert('Attendance marked successfully!');
      setAttendance({});
    } catch (error) {
      console.error('[v0] Error marking attendance:', error);
      alert('Error marking attendance');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mark Attendance</h1>
          <p className="text-gray-600 mt-1">Record student attendance</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} - {cls.section}
                </option>
              ))}
            </select>
          </div>

          {students.length > 0 ? (
            <>
              <div className="overflow-x-auto mb-6">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Student Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-t border-gray-200">
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {student.first_name} {student.last_name}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <select
                            value={attendance[student.id] || ''}
                            onChange={(e) => handleAttendanceChange(student.id, e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Status</option>
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="late">Late</option>
                            <option value="excused">Excused</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Submit Attendance
              </button>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No students in this class
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
