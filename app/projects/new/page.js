'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function NewProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    entry_date: '',
    project_no: '',
    client: '',
    project_name: '',
    scanned_by: '',
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
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      project_no: parseInt(form.project_no, 10),
    };
    const { error } = await supabase.from('project_track').insert([payload]);
    setLoading(false);
    if (error) {
      alert(error.message);
    } else {
      router.push('/projects');
    }
  }

  const statusKeys = [
    'description','levels','dwg','template','revit_version',
    'arch_emd','google_earth_link','mep_emd_tier','comments',
    'file_sharing','scanning_date','pdf'
  ];

  return (
    <main className="p-6 bg-white text-gray-900 min-h-screen">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-white pb-4 mb-4">
        <div className="flex items-center justify-between">
          <Link
            href="/projects"
            className="text-teal-500 hover:underline"
          >
            ← Back to Hub
          </Link>
          <h1 className="text-2xl font-bold">New Project</h1>
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
              ['project_no','number','Project No.'],
              ['client','text','Client'],
              ['project_name','text','Project Name'],
              ['scanned_by','text','Scanned By'],
              ['actual_delivery_date','date','Actual Delivery Date'],
            ].map(([name,type,label]) => (
              <div key={name}>
                <label className="block font-medium">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
                  required
                />
              </div>
            ))}
          </div>

          {/* Status fields */}
          <div className="grid grid-cols-2 gap-4">
            {statusKeys.map((key) => (
              <div key={key}>
                <label className="block font-medium">
                  {key.replace(/_/g, ' ')}
                </label>
                <input
                  type="text"
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
          >
            {loading ? 'Saving…' : 'Create Project'}
          </button>
        </form>
      </div>
    </main>
  );
}