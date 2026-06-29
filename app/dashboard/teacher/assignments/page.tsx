'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/app/hooks/useAuth';

export default function TeacherAssignments() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
  });
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
    const fetchAssignments = async () => {
      if (!selectedClass) return;

      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('assignments')
          .select('*')
          .eq('class_id', selectedClass)
          .order('created_at', { ascending: false });

        setAssignments(data || []);
      } catch (error) {
        console.error('[v0] Error fetching assignments:', error);
      }
    };

    fetchAssignments();
  }, [selectedClass]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser || !selectedClass) return;

      const { error } = await supabase
        .from('assignments')
        .insert({
          class_id: selectedClass,
          title: formData.title,
          description: formData.description,
          due_date: new Date(formData.dueDate).toISOString(),
          created_by: authUser.id,
        });

      if (error) throw error;

      setFormData({ title: '', description: '', dueDate: '' });
      alert('Assignment created successfully!');

      // Refresh assignments
      const { data } = await supabase
        .from('assignments')
        .select('*')
        .eq('class_id', selectedClass)
        .order('created_at', { ascending: false });

      setAssignments(data || []);
    } catch (error) {
      console.error('[v0] Error creating assignment:', error);
      alert('Error creating assignment');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600 mt-1">Create and manage assignments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create Assignment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Assignment title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Assignment description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Create Assignment
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Your Assignments</h2>
            {assignments.length > 0 ? (
              assignments.map((assignment) => (
                <div key={assignment.id} className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold text-gray-900">{assignment.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{assignment.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-gray-500">
                      Due: {new Date(assignment.due_date).toLocaleDateString()}
                    </p>
                    <button className="text-blue-600 hover:text-blue-800 font-medium">View Submissions</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                No assignments created yet
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
