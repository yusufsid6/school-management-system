'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/hooks/useAuth';

export default function TeacherGrades() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [students, setStudents] = useState<any[]>([]);
  const [grades, setGrades] = useState<Record<string, any>>({});
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

        const { data: enrollmentsData } = await supabase
          .from('students_classes')
          .select('student_id')
          .eq('class_id', selectedClass);

        const studentIds = enrollmentsData?.map((e) => e.student_id) || [];

        if (studentIds.length === 0) {
          setStudents([]);
          return;
        }

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

  const handleGradeChange = (studentId: string, field: string, value: any) => {
    setGrades((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      const supabase = createClient();

      const gradeRecords = Object.entries(grades).map(([studentId, gradeData]: any) => ({
        student_id: studentId,
        class_id: selectedClass,
        subject: gradeData.subject,
        term: gradeData.term,
        marks_obtained: parseFloat(gradeData.marks_obtained),
        total_marks: 100,
        grade: gradeData.grade,
        comments: gradeData.comments,
      }));

      const { error } = await supabase
        .from('grades')
        .upsert(gradeRecords);

      if (error) throw error;
      alert('Grades submitted successfully!');
      setGrades({});
    } catch (error) {
      console.error('[v0] Error submitting grades:', error);
      alert('Error submitting grades');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enter Grades</h1>
          <p className="text-gray-600 mt-1">Record student grades and performance</p>
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
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {students.length > 0 ? (
            <>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Student</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Subject</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Term</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Marks</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-t border-gray-200">
                        <td className="px-4 py-3 text-gray-900 font-medium">
                          {student.first_name} {student.last_name}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            placeholder="Subject"
                            value={grades[student.id]?.subject || ''}
                            onChange={(e) => handleGradeChange(student.id, 'subject', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={grades[student.id]?.term || ''}
                            onChange={(e) => handleGradeChange(student.id, 'term', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Term</option>
                            <option value="Term 1">Term 1</option>
                            <option value="Term 2">Term 2</option>
                            <option value="Term 3">Term 3</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="Marks"
                            value={grades[student.id]?.marks_obtained || ''}
                            onChange={(e) => handleGradeChange(student.id, 'marks_obtained', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={grades[student.id]?.grade || ''}
                            onChange={(e) => handleGradeChange(student.id, 'grade', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Grade</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="F">F</option>
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
                Submit Grades
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
