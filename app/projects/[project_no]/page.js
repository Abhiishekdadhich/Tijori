'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import {
  ArrowLeft,
  Edit,
  Download,
  Building2,
  Calendar,
  Star as StarIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DeleteProjectButton from './components/DeleteProjectButton';
import ProjectDetailTabs from './components/ProjectDetailTabs';

export default function ProjectDetail({ params }) {
  // Unwrap params using React.use() as recommended for future compatibility
  const unwrappedParams = use(params);
  const { project_no } = unwrappedParams;
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProject() {
      try {
        const { data, error } = await supabase
          .from('project_track')
          .select('*')
          .eq('project_no', parseInt(project_no, 10))
          .single();
          
        if (error) throw error;
        setProject(data);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProject();
  }, [project_no]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-xl text-gray-600">Loading project data...</div>
      </div>
    );
  }
  
  if (error || !project) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-xl text-red-600 text-center">
          <p>Error loading project</p>
          <button 
            onClick={() => router.push('/projects')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Return to Project Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link href="/projects" className="flex items-center text-blue-600 hover:text-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Project Hub
              </Link>
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link
                  href="#"
                  className="flex items-center bg-white text-gray-800 hover:bg-gray-100"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Link href={`/projects/${project_no}/edit`} className="flex items-center">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <DeleteProjectButton projectNo={project_no} />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {project.project_name || `Project ${project.project_no}`}
              </h1>
              <p className="text-blue-100 text-lg">Project #{project.project_no}</p>
              <div className="flex items-center mt-4 space-x-6">
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  <span>{project.client}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{project.entry_date}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <StarIcon className="h-5 w-5 mr-2 text-yellow-500" />
              Project Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectDetailTabs project={project} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
