'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { CheckCircleIcon, XCircleIcon, FunnelIcon, ArrowsUpDownIcon } from '@heroicons/react/24/solid';
import ProjectsDashboard from './components/ProjectsDashboard';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('entry_date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filters, setFilters] = useState({
    client: '',
    revit_version: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [dashboardError, setDashboardError] = useState(null);
  
  // Get unique clients and revit versions for filters
  const uniqueClients = [...new Set(projects.map(p => p.client).filter(Boolean))];
  const uniqueRevitVersions = [...new Set(projects.map(p => p.revit_version).filter(Boolean))];

  useEffect(() => {
    fetchProjects();
  }, [sortField, sortDirection]);
  
  async function fetchProjects() {
    setLoading(true);
    
    let query = supabase
      .from('project_track')
      .select('*')
      .order(sortField, { ascending: sortDirection === 'asc' });
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } else {
      setProjects(data || []);
    }
    
    setLoading(false);
  }

  function handleSort(field) {
    if (field === sortField) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to descending
      setSortField(field);
      setSortDirection('desc');
    }
  }

  function toggleFilters() {
    setShowFilters(!showFilters);
  }

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  }

  function resetFilters() {
    setFilters({
      client: '',
      revit_version: '',
    });
  }

  // Apply filters and search
  const filtered = projects.filter((proj) => {
    // Handle search term
    const term = searchTerm.toLowerCase();
    const searchMatch = !searchTerm || (
      (proj.client && proj.client.toLowerCase().includes(term)) ||
      (proj.project_name && proj.project_name.toLowerCase().includes(term)) ||
      (proj.entry_date && proj.entry_date.includes(term)) ||
      (proj.project_no && proj.project_no.toString().includes(term))
    );
    
    // Handle filters
    const clientMatch = !filters.client || proj.client === filters.client;
    const revitMatch = !filters.revit_version || proj.revit_version === filters.revit_version;
    
    return searchMatch && clientMatch && revitMatch;
  });

  return (
    <main className="p-6 bg-white text-gray-900">
      {/* Sticky header with New Project button */}
      <div className="sticky top-0 z-20 bg-white pb-4 border-b border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold">Project Hub</h1>
          <Link
            href="/projects/new"
            className="inline-block px-4 py-2 bg-teal-500 text-white rounded-lg shadow hover:bg-teal-600 transition"
          >
            + New Project
          </Link>
        </div>
      </div>
      
      {/* Dashboard Overview - NOT sticky (normal scroll) */}
      <div className="bg-white mb-4">
        <ProjectsDashboard />
      </div>
      
      {/* Search & filters - Sticky below header */}
      <div className="sticky top-16 z-10 bg-white pt-2 pb-2 border-b border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by client, project, date or number…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-indigo-300"
          />
          <button 
            onClick={toggleFilters}
            className="p-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
          >
            <FunnelIcon className="h-5 w-5 text-gray-700" />
          </button>
        </div>
        
        {/* Filter panel */}
        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-4 mt-2 border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-medium">Advanced Filters</h2>
              <button 
                onClick={resetFilters} 
                className="text-sm text-blue-600 hover:underline"
              >
                Reset
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Client</label>
                <select 
                  name="client"
                  value={filters.client}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-indigo-300"
                >
                  <option value="">All Clients</option>
                  {uniqueClients.map(client => (
                    <option key={client} value={client}>{client}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Revit Version</label>
                <select 
                  name="revit_version"
                  value={filters.revit_version}
                  onChange={handleFilterChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-indigo-300"
                >
                  <option value="">All Versions</option>
                  {uniqueRevitVersions.map(version => (
                    <option key={version} value={version}>{version}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Sort By</label>
                <div className="flex gap-1">
                  <select
                    value={sortField}
                    onChange={(e) => handleSort(e.target.value)}
                    className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-indigo-300"
                  >
                    <option value="entry_date">Entry Date</option>
                    <option value="project_no">Project No</option>
                    <option value="client">Client</option>
                    <option value="project_name">Project Name</option>
                  </select>
                  <button
                    onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                    className="p-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
                  >
                    <ArrowsUpDownIcon className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results count & stats */}
      <div className="mt-6 mb-4 flex justify-between items-center pt-2 border-t border-gray-100">
        <div className="text-gray-700">
          {loading ? (
            <span>Loading projects...</span>
          ) : (
            <span>
              {filtered.length} projects found
              {filters.client && ` for ${filters.client}`}
            </span>
          )}
        </div>
        
        <div className="text-sm text-gray-500">
          {!loading && (
            <div className="flex gap-4">
              <span>{projects.filter(p => p.dwg).length} with DWG</span>
              <span>{projects.filter(p => p.pdf).length} with PDF</span>
            </div>
          )}
        </div>
      </div>

      {/* Cards grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-600">Loading projects...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <div className="text-xl text-gray-600 mb-2">No projects found</div>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((proj) => (
            <Link
              key={proj.project_no}
              href={`/projects/${proj.project_no}`}
              className="block"
            >
              <ProjectCard project={proj} />
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

function ProjectCard({ project }) {
  const coreFields = [
    ['Entry Date',           project.entry_date],
    ['Project No.',          project.project_no],
    ['Client',               project.client],
    ['Project Name',         project.project_name],
    ['Scanned By',           project.scanned_by],
    ['Actual Delivery Date', project.actual_delivery_date],
  ];

  const statusFields = [
    ['Description',        project.description],
    ['Levels',             project.levels],
    ['DWG',                project.dwg],
    ['Template',           project.template],
    ['Revit Version',      project.revit_version],
    ['Arch EMD',           project.arch_emd],
    ['Google Earth Link',  project.google_earth_link],
    ['MEP EMD & Tier',     project.mep_emd_tier],
    ['Comments',           project.comments],
    ['File Sharing',       project.file_sharing],
    ['Scanning Date',      project.scanning_date],
    ['PDF',                project.pdf],
  ];

  return (
    <div className="group flex flex-col h-full bg-gray-50 ring-1 ring-gray-200 rounded-xl p-6 shadow-sm transform transition-all hover:shadow-md hover:ring-indigo-200 hover:bg-white hover:-translate-y-1">
      {/* Expanding gradient stripe */}
      <div className="h-1 w-16 group-hover:w-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded transition-all duration-500 mb-4" />

      {/* Core fields */}
      <div className="space-y-3 mb-4">
        {coreFields.map(([label, value]) => (
          <div key={label} className="flex">
            <div className="w-32 font-medium text-gray-700">{label}</div>
            <div className="flex-1 text-gray-900 break-words">{value ?? '—'}</div>
          </div>
        ))}
      </div>

      {/* Status at bottom */}
      <div className="mt-auto border-t border-gray-200 pt-4 grid grid-cols-2 gap-3">
        {statusFields.map(([label, value]) => (
          <div key={label} className="flex items-center space-x-2">
            {value ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            ) : (
              <XCircleIcon className="h-5 w-5 text-gray-300" />
            )}
            <span className="text-sm text-gray-800">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}