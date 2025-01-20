import { useState } from 'react';
import { DepartmentHeader } from './department-header';
import { StudentList } from './student-list';
import type { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface DepartmentSectionProps {
  name: string;
  students: Profile[];
  studentCount: number;
  selectedUniversity: string;
}

export function DepartmentSection({ 
  name, 
  students, 
  studentCount,
  selectedUniversity 
}: DepartmentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      <DepartmentHeader
        name={name}
        studentCount={studentCount}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />

      {isExpanded && (
        <div className="p-6">
          <StudentList 
            students={students} 
            selectedUniversity={selectedUniversity}
          />
        </div>
      )}
    </div>
  );
}