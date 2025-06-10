'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

// Field mapping to display friendly names for database columns
const getFieldDisplayName = (fieldName) => {
  const fieldMap = {
    'entry_date': 'Entry Date',
    'project_no': 'Project No.',
    'client': 'Client',
    'project_name': 'Project Name',
    'category': 'Category',
    'scanned_by': 'Scanned By',
    'target_delivery_date': 'Target Delivery Date',
    'actual_delivery_date': 'Actual Delivery Date',
    'description': 'Description',
    'levels': 'Levels',
    'dwg': 'DWG',
    'template': 'Template',
    'revit_version': 'Revit Version',
    'deliverables_arch': 'Arch EMD',
    'google_earth_link': 'Google Earth Link',
    'deliverables_mep': 'MEP EMD & Tier',
    'comments': 'Comments',
    'file_sharing': 'File Sharing',
    'scanning_date': 'Scanning Date',
    'pdf': 'PDF',
    'attachments': 'Attachments',
  };
  
  return fieldMap[fieldName] || fieldName.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function NewProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    entry_date: '',
    project_no: '',
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
    deliverables_arch: '',
    google_earth_link: '',
    deliverables_mep: '',
    comments: '',
    file_sharing: '',
    scanning_date: '',
    pdf: '',
    attachments: '',
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
    'deliverables_arch','google_earth_link','deliverables_mep','comments',
    'file_sharing','scanning_date','pdf','attachments'
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
              ['category','text','Category'],
              ['scanned_by','text','Scanned By'],
              ['target_delivery_date','date','Target Delivery Date'],
              ['actual_delivery_date','date','Actual Delivery Date'],
            ].map(([name,type,label]) => (
              <div key={name}>
                <label className="block font-medium">{getFieldDisplayName(name)}</label>
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
                  {getFieldDisplayName(key)}
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