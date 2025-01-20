import { useState } from 'react';
import { ProjectList } from '@/components/project/project-list';
import { SearchBar } from '@/components/search/search-bar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusSquare } from 'lucide-react';

export function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-[630px] mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Discover innovative projects from UC students</p>
        </div>
        <Link to="/create">
          <Button>
            <PlusSquare className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <SearchBar onSearch={setSearchQuery} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">All</Button>
            <Button variant="ghost" size="sm">In Progress</Button>
            <Button variant="ghost" size="sm">Completed</Button>
            <Button variant="ghost" size="sm">Planning</Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select className="text-sm border-none bg-transparent focus:ring-0">
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="trending">Trending</option>
            </select>
          </div>
        </div>

        <ProjectList searchQuery={searchQuery} />
      </div>
    </div>
  );
}