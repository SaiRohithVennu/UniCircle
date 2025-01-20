import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectForm } from '@/components/project/project-form';
import { FileUpload } from '@/components/file/file-upload';

export function CreateProjectPage() {
  const [imageUrl, setImageUrl] = useState<string>();
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Project</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Project Image</h2>
          <FileUpload onUpload={setImageUrl} />
        </div>

        <ProjectForm
          onSuccess={() => navigate('/')}
        />
      </div>
    </div>
  );
}