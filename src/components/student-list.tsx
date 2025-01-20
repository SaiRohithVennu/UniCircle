import { MessageSquare, UserPlus } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface StudentListProps {
  students: Profile[];
  selectedUniversity: string;
}

const SAMPLE_STUDENTS = [
  {
    id: '1',
    first_name: 'Alex',
    last_name: 'Chen',
    avatar_url: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d',
    university: 'University of Cincinnati',
    department: 'Computer Science'
  },
  {
    id: '2',
    first_name: 'Sarah',
    last_name: 'Miller',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    university: 'Ohio State University',
    department: 'Computer Science'
  },
  {
    id: '3',
    first_name: 'James',
    last_name: 'Wilson',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    university: 'Miami University',
    department: 'Data Science'
  },
  {
    id: '4',
    first_name: 'Emily',
    last_name: 'Rodriguez',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    university: 'Xavier University',
    department: 'Digital Arts'
  },
  {
    id: '5',
    first_name: 'Michael',
    last_name: 'Thompson',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    university: 'Northern Kentucky University',
    department: 'Environmental Engineering'
  },
  // Additional students for each university
  {
    id: '6',
    first_name: 'David',
    last_name: 'Kim',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    university: 'University of Cincinnati',
    department: 'Information Technology'
  },
  {
    id: '7',
    first_name: 'Sophia',
    last_name: 'Lee',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    university: 'Ohio State University',
    department: 'Mechanical Engineering'
  },
  {
    id: '8',
    first_name: 'Ethan',
    last_name: 'Garcia',
    avatar_url: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d',
    university: 'Miami University',
    department: 'Psychology'
  },
  {
    id: '9',
    first_name: 'Olivia',
    last_name: 'Martinez',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    university: 'Xavier University',
    department: 'Computer Science'
  },
  {
    id: '10',
    first_name: 'William',
    last_name: 'Brown',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    university: 'Northern Kentucky University',
    department: 'Data Science'
  }
];

export function StudentList({ selectedUniversity }: StudentListProps) {
  // Filter students based on selected university and department
  const filteredStudents = SAMPLE_STUDENTS.filter(student => {
    if (selectedUniversity === 'All Universities') {
      return true;
    }
    return student.university === selectedUniversity;
  });

  if (filteredStudents.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No students found from {selectedUniversity}.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {filteredStudents.map((student) => (
        <div key={student.id} className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <Avatar
              src={student.avatar_url || undefined}
              alt={`${student.first_name} ${student.last_name}`}
              size="sm"
            />
            <div>
              <h4 className="font-medium text-gray-900">
                {student.first_name} {student.last_name}
              </h4>
              <p className="text-sm text-gray-500">
                {student.university} • {student.department}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
            <Button variant="ghost" size="sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Follow
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}