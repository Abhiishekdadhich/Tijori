'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, use } from 'react';
import { supabase } from '../../../../lib/supabaseClient';

export default function EditProjectPage({ params }) {
  const router = useRouter();
  // Unwrap params using React.use() as recommended for future compatibility
  const unwrappedParams = use(params);
  const { project_no } = unwrappedParams;
  const [form, setForm] = useState({
    entry_date: '',
    project_no: project_no,
    client: '',
    project_name: '',
    category: '',
    scanned_by: '',
    target_delivery_date: '',
    actual_delivery_date: '',
    description: '',
    levels: '',
    dwg: '',
    template: '',
    revit_version: '',
    arch_emd: '',
    google_earth_link: '',
    mep_emd_tier: '',
    comments: '',
    file_sharing: '',
    scanning_date: '',
    pdf: '',
    attachments: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // Fetch existing project data
  useEffect(() => {
    async function fetchProject() {
      setFetchLoading(true);
      const { data, error } = await supabase
        .from('project_track')
        .select('*')
        .eq('project_no', parseInt(project_no, 10))
        .single();

      if (error) {
        console.error('Error fetching project:', error);
        alert('Failed to load project data');
        router.push('/projects');
        return;
      }

      setForm(data);
      setFetchLoading(false);
    }

    fetchProject();
  }, [project_no, router]);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    
    // Ensure project_no is an integer
    const payload = {
      ...form,
      project_no: parseInt(form.project_no, 10),
    };
    
    const { error } = await supabase
      .from('project_track')
      .update(payload)
      .eq('project_no', parseInt(project_no, 10));
    
    setLoading(false);
    
    if (error) {
      alert(`Error updating project: ${error.message}`);
    } else {
      router.push(`/projects/${project_no}`);
    }
  }

  const statusKeys = [
    'description','levels','dwg','template','revit_version',
    'arch_emd','google_earth_link','mep_emd_tier','comments',
    'file_sharing','scanning_date','pdf','attachments'
  ];

  if (fetchLoading) {
    return (
      <main className="p-6 bg-white text-gray-900 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Loading project data...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 bg-white text-gray-900 min-h-screen">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-white pb-4 mb-4">
        <div className="flex items-center justify-between">
          <Link
            href={`/projects/${project_no}`}
            className="text-teal-500 hover:underline"
          >
            ← Back to Project
          </Link>
          <h1 className="text-2xl font-bold">Edit Project #{project_no}</h1>
          <div />{/* spacer */}
        </div>
      </div>

      {/* Form container */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Core fields */}
          <div className="grid grid-cols-2 gap-4">
            {[
              ['entry_date','date','Entry Date'],
              ['client','text','Client'],
              ['project_name','text','Project Name'],
              ['category','text','Category'],
              ['scanned_by','text','Scanned By'],
              ['target_delivery_date','date','Target Delivery Date'],
              ['actual_delivery_date','date','Actual Delivery Date'],
            ].map(([name,type,label]) => (
              <div key={name}>
                <label className="block font-medium">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={form[name] || ''}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>
            ))}
            
            {/* Project number field (disabled) */}
            <div>
              <label className="block font-medium">Project No.</label>
              <input
                type="number"
                name="project_no"
                value={form.project_no}
                disabled
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">Project number cannot be changed</p>
            </div>
          </div>

          {/* Status fields */}
          <div className="grid grid-cols-2 gap-4">
            {statusKeys.map((key) => (
              <div key={key}>
                <label className="block font-medium">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
                </label>
                <input
                  type="text"
                  name={key}
                  value={form[key] || ''}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>
            ))}
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition flex-1"
            >
              {loading ? 'Saving…' : 'Update Project'}
            </button>
            
            <Link
              href={`/projects/${project_no}`}
              className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition text-center flex-1"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
