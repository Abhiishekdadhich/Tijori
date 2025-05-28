'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  FolderOpen, 
  MessageCircle,
  Settings,
  CheckCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function ProjectDetailTabs({ project }) {
  const [activeTab, setActiveTab] = useState('details');
  
  const titleCase = (str) =>
    str
      .replace(/_/g, ' ')
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  // Tab content rendering
  const renderTabContent = () => {
    switch(activeTab) {
      case 'details':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                'entry_date',
                'project_no',
                'client',
                'project_name',
                'actual_delivery_date',
                'scanned_by',
                'scanning_date',
              ].map((key) => (
                <DetailField key={key} label={titleCase(key)} value={project[key]} />
              ))}
            </div>
          </div>
        );
      
      case 'files':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                'dwg',
                'template',
                'pdf',
                'file_sharing',
              ].map((key) => (
                <DetailField key={key} label={titleCase(key)} value={project[key]} isFile />
              ))}
              {project.google_earth_link && (
                <div className="col-span-2 p-4 bg-white rounded-lg border border-gray-100">
                  <div className="text-sm font-medium text-gray-600 mb-2">Google Earth Link</div>
                  <a
                    href={project.google_earth_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {project.google_earth_link}
                  </a>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'specs':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                'description',
                'levels',
                'revit_version',
                'arch_emd',
                'mep_emd_tier',
              ].map((key) => (
                <DetailField key={key} label={titleCase(key)} value={project[key]} />
              ))}
            </div>
          </div>
        );
      
      case 'notes':
        return (
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Project Comments</h3>
              {project.comments ? (
                <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                  {project.comments}
                </div>
              ) : (
                <div className="text-gray-500">No comments added for this project.</div>
              )}
            </Card>
          </div>
        );
      
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500 mb-4">
        <button 
          onClick={() => setActiveTab('details')}
          className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all gap-2 ${activeTab === 'details' ? 'bg-white text-slate-900 shadow-sm' : ''}`}
        >
          <FileText className="h-4 w-4" />
          Details
        </button>
        <button 
          onClick={() => setActiveTab('files')}
          className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all gap-2 ${activeTab === 'files' ? 'bg-white text-slate-900 shadow-sm' : ''}`}
        >
          <FolderOpen className="h-4 w-4" />
          Files
        </button>
        <button 
          onClick={() => setActiveTab('specs')}
          className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all gap-2 ${activeTab === 'specs' ? 'bg-white text-slate-900 shadow-sm' : ''}`}
        >
          <Settings className="h-4 w-4" />
          Specifications
        </button>
        <button 
          onClick={() => setActiveTab('notes')}
          className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all gap-2 ${activeTab === 'notes' ? 'bg-white text-slate-900 shadow-sm' : ''}`}
        >
          <MessageCircle className="h-4 w-4" />
          Notes
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="mt-2">
        {renderTabContent()}
      </div>
    </div>
  );
}

// Helper component for displaying a detail field
function DetailField({ label, value, isFile = false }) {
  const hasValue = value !== null && value !== undefined && value !== '';
  
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-100">
      <div className="text-sm font-medium text-gray-600 mb-2 flex items-center">
        {isFile && hasValue && (
          <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
        )}
        {label}
      </div>
      <div className="text-gray-900 font-medium">
        {hasValue ? value.toString() : '—'}
      </div>
    </div>
  );
}
