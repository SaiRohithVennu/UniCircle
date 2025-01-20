import { useState } from 'react';
import { SearchBar } from '@/components/search/search-bar';
import { DepartmentSection } from '@/components/department/department-section';
import { Loader } from 'lucide-react';
import { useDepartments } from '@/hooks/use-departments';
import { Button } from '@/components/ui/button';

const UNIVERSITIES = [
  'All Universities',
  'University of Cincinnati',
  'Ohio State University',
  'Miami University',
  'Xavier University',
  'Northern Kentucky University'
];

const DEPARTMENTS = [
  'Computer Science',
  'Data Science',
  'Digital Arts',
  'Environmental Engineering',
  'Information Technology',
  'Mechanical Engineering',
  'Psychology'
];

export function DepartmentsPage() {
  const { departments, loading, error } = useDepartments();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('All Universities');

  // Filter departments based on search
  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mb-16 md:mb-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
        <p className="text-gray-600 mt-1">
          Browse students and projects by department
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <SearchBar 
          onSearch={setSearchQuery}
          placeholder="Search departments..." 
        />

        <div className="flex flex-wrap gap-2">
          {UNIVERSITIES.map((university) => (
            <Button
              key={university}
              variant={selectedUniversity === university ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedUniversity(university)}
              className="whitespace-nowrap"
            >
              {university}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-orange-600" />
        </div>
      ) : error ? (
        <div className="bg-orange-50 text-orange-600 p-4 rounded-lg">
          {error}
        </div>
      ) : filteredDepartments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No departments found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {DEPARTMENTS.map((deptName) => (
            <DepartmentSection
              key={deptName}
              name={deptName}
              students={[]} // We're using sample data in StudentList
              studentCount={10} // Sample count
              selectedUniversity={selectedUniversity}
            />
          ))}
        </div>
      )}
    </div>
  );
}