import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Users, Building2 } from 'lucide-react';

export function FeedTabs() {
  const [activeTab, setActiveTab] = useState<'students' | 'companies'>('students');

  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant={activeTab === 'students' ? 'primary' : 'ghost'}
        onClick={() => setActiveTab('students')}
        className="flex-1"
      >
        <Users className="w-4 h-4 mr-2" />
        Student Feed
      </Button>
      <Button
        variant={activeTab === 'companies' ? 'primary' : 'ghost'}
        onClick={() => setActiveTab('companies')}
        className="flex-1"
      >
        <Building2 className="w-4 h-4 mr-2" />
        Company Feed
      </Button>
    </div>
  );
}