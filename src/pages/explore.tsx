import { ProjectList } from '@/components/project/project-list';
import { SearchBar } from '@/components/search/search-bar';
import { useState } from 'react';

export function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-[630px] mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Explore Projects</h1>
        <p className="text-gray-600 mt-1">Discover innovative projects from UC students</p>
      </div>

      <div className="mb-6">
        <SearchBar onSearch={setSearchQuery} />
      </div>

      <ProjectList searchQuery={searchQuery} />
    </div>
  );
}