import { useEffect } from 'react';
import { useProjectStore } from '@/stores/project-store';
import { Loader } from 'lucide-react';
import { ChatToggle } from '@/components/chat/chat-toggle';
import { ChatBox } from '@/components/chat/chat-box';
import { Logo } from '@/components/layout/logo';
import { useAuthStore } from '@/stores/auth-store';
import { FeedList } from '@/components/feed/feed-list';
import { CreatePost } from '@/components/post/create-post';
import { SuggestedUsers } from '@/components/user/suggested-users';

export function HomePage() {
  const { projects, loading, error, fetchProjects } = useProjectStore();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="md:hidden mb-6">
        <Logo />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar - Profile Summary */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-orange-500 to-orange-600" />
            <div className="px-4 pb-4">
              <div className="-mt-10 mb-4">
                <img
                  src={user?.avatar_url || "https://i.postimg.cc/GmHHCvXM/Screenshot-at-Jan-20-11-18-46.png"}
                  alt={user?.first_name}
                  className="w-20 h-20 rounded-full border-4 border-white object-cover"
                />
              </div>
              <h2 className="font-semibold text-gray-900">
                {user?.first_name} {user?.last_name}
              </h2>
              <p className="text-sm text-gray-500">{user?.department}</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Profile views</span>
                  <span className="font-medium text-orange-600">127</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-500">Post impressions</span>
                  <span className="font-medium text-orange-600">1,234</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-6">
          <div className="space-y-4">
            <CreatePost />
            <FeedList />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-3 space-y-6">
          {/* Suggested Users */}
          <SuggestedUsers />

          {/* News & Updates */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="font-semibold text-gray-900 mb-4">UC News & Events</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-orange-600" />
                <div>
                  <p className="text-sm text-gray-900">Startup Weekend 2024 Registration Open</p>
                  <p className="text-xs text-gray-500 mt-1">2 days ago • 234 students interested</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-orange-600" />
                <div>
                  <p className="text-sm text-gray-900">New Innovation Lab Opening Next Month</p>
                  <p className="text-xs text-gray-500 mt-1">5 days ago • 456 students interested</p>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Companies */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="font-semibold text-gray-900 mb-4">Featured Companies</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://via.placeholder.com/40"
                  alt="TechStart Labs"
                  className="w-10 h-10 rounded"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">TechStart Labs</p>
                  <p className="text-xs text-gray-500">Software Development</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src="https://via.placeholder.com/40"
                  alt="EcoSolutions"
                  className="w-10 h-10 rounded"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">EcoSolutions</p>
                  <p className="text-xs text-gray-500">Environmental Tech</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ChatToggle />
      <ChatBox />
    </div>
  );
}