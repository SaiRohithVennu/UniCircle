import { ChevronDown, ChevronRight, Users } from 'lucide-react';

interface DepartmentHeaderProps {
  name: string;
  studentCount: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export function DepartmentHeader({ name, studentCount, isExpanded, onToggle }: DepartmentHeaderProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center space-x-3">
        <h2 className="text-xl font-bold text-gray-900">{name}</h2>
        <div className="flex items-center text-sm text-gray-500">
          <Users className="w-4 h-4 mr-1" />
          {studentCount} students
        </div>
      </div>
      {isExpanded ? (
        <ChevronDown className="w-5 h-5 text-gray-500" />
      ) : (
        <ChevronRight className="w-5 h-5 text-gray-500" />
      )}
    </button>
  );
}