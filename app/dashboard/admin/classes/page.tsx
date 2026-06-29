'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { createClient } from '@/lib/supabase/client';

export default function AdminClasses() {
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    section: '',
    gradeLevel: '',
    capacity: '',
    teacherId: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();

        // Fetch classes
        const { data: classesData } = await supabase
          .from('classes')
          .select('*, teacher:teacher_id(first_name, last_name)')
          .order('created_at', { ascending: false });

        // Fetch teachers
        const { data: teachersData } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .eq('role', 'teacher');

        setClasses(classesData || []);
        setTeachers(teachersData || []);
      } catch (error) {
        console.error('[v0] Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('classes')
        .insert({
          name: formData.name,
          section: formData.section,
          grade_level: parseInt(formData.gradeLevel),
          capacity: parseInt(formData.capacity),
          teacher_id: formData.teacherId || null,
        });

      if (error) throw error;

      alert('Class created successfully!');
      setFormData({ name: '', section: '', gradeLevel: '', capacity: '', teacherId: '' });

      // Refresh classes
      const { data: classesData } = await supabase
        .from('classes')
        .select('*, teacher:teacher_id(first_name, last_name)')
        .order('created_at', { ascending: false });

      setClasses(classesData || []);
    } catch (error) {
      console.error('[v0] Error creating class:', error);
      alert('Error creating class');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Classes</h1>
          <p className="text-gray-600 mt-1">Create and manage school classes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create Class</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Class 10-A"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                <input
                  type="text"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                <input
                  type="number"
                  value={formData.gradeLevel}
                  onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 10"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Teacher</label>
                <select
                  value={formData.teacherId}
                  onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.first_name} {teacher.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Create Class
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">All Classes</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Grade</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Teacher</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Capacity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.length > 0 ? (
                      classes.map((cls) => (
                        <tr key={cls.id} className="border-t border-gray-200 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {cls.name} - {cls.section}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{cls.grade_level}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {cls.teacher ? `${cls.teacher.first_name} ${cls.teacher.last_name}` : 'Unassigned'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{cls.capacity}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                          No classes found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
