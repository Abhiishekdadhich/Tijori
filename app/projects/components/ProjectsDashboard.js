'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { 
  BarChart3, 
  CalendarRange, 
  FolderClosed, 
  FolderOpen,
  CheckCircle2
} from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';

export default function ProjectsDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    withDwg: 0,
    withPdf: 0,
    activeClients: 0,
    completedProjects: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      
      // Get all projects
      const { data, error } = await supabase
        .from('project_track')
        .select('*')
        .order('entry_date', { ascending: false });
        
      if (error) {
        console.error('Error fetching projects for stats:', error);
        return;
      }
      
      const projects = data || [];
      
      // Calculate stats
      const withDwg = projects.filter(p => p.dwg).length;
      const withPdf = projects.filter(p => p.pdf).length;
      const uniqueClients = [...new Set(projects.map(p => p.client).filter(Boolean))];
      // Updated to just check for actual_delivery_date
      const completedProjects = projects.filter(p => p.actual_delivery_date).length;
      
      setStats({
        total: projects.length,
        withDwg,
        withPdf,
        activeClients: uniqueClients.length,
        completedProjects,
      });
      
      // Get recent projects (last 5)
      setRecentActivity(projects.slice(0, 5));
      
      setLoading(false);
    }
    
    fetchStats();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }
  
  return (
    <div className="mb-4 bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm transition-all duration-300">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <BarChart3 className="h-5 w-5 mr-2 text-teal-600" />
        Projects Overview
      </h2>
      
      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Projects"
          value={stats.total}
          icon={<FolderClosed className="h-5 w-5" />}
        />
        <StatCard
          title="Active Clients"
          value={stats.activeClients}
          icon={<CalendarRange className="h-5 w-5" />}
        />
        <StatCard
          title="Projects with DWG"
          value={`${stats.withDwg}`}
          description={stats.total > 0 ? `(${Math.round((stats.withDwg / stats.total) * 100)}%)` : ''}
          icon={<FolderOpen className="h-5 w-5" />}
        />
        <StatCard
          title="Completed Projects"
          value={stats.completedProjects}
          description={stats.total > 0 ? `(${Math.round((stats.completedProjects / stats.total) * 100)}%)` : ''}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
      </div>
      
      {/* Recent Activity */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Recent Projects</h3>
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentActivity.map((project) => (
                <tr key={project.project_no} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {project.project_name || `Project ${project.project_no}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{project.project_no}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.client || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.entry_date || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isProjectComplete(project) ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Complete
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        In Progress
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              
              {recentActivity.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No recent projects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Helper to check if a project is complete
function isProjectComplete(project) {
  // Now just check if actual_delivery_date exists
  // We'll add more complex logic in future updates
  return project.actual_delivery_date ? true : false;
}
