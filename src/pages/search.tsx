import { SearchBar } from '@/components/search/search-bar';
import { useState } from 'react';
import { ProjectList } from '@/components/project/project-list';

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-[630px] mx-auto py-8 px-4">
      <div className="mb-8">
        <SearchBar 
          onSearch={setSearchQuery}
          placeholder="Search projects or students..." 
        />
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold mb-4">Projects</h2>
          <ProjectList searchQuery={searchQuery} />
        </section>
      </div>
    </div>
  );
}