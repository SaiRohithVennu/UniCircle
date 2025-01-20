import { Camera, Grid, Link as LinkIcon, MapPin, MessageSquare, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';

const PROFILE_DATA = {
  name: 'Sarah Chen',
  username: '@sarahchen',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  department: 'Computer Science',
  year: 'Senior',
  bio: 'Building the future of education technology | AI Enthusiast | Full-stack Developer',
  interests: ['Artificial Intelligence', 'Web Development', 'UX Design', 'Entrepreneurship'],
  location: 'Cincinnati, OH',
  website: 'sarahchen.dev',
  stats: {
    projects: 12,
    connections: 458,
    collaborations: 23
  },
  moments: [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
      title: 'AI Project Demo'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
      title: 'Team Hackathon'
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca',
      title: 'Design Workshop'
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998',
      title: 'Pitch Competition'
    }
  ]
};

function ProfileHeader() {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6">
      <Avatar
        src={PROFILE_DATA.avatar}
        alt={PROFILE_DATA.name}
        size="lg"
        className="w-24 h-24 md:w-32 md:h-32"
      />
      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{PROFILE_DATA.name}</h1>
            <p className="text-gray-600">{PROFILE_DATA.username}</p>
          </div>
          <div className="flex gap-2">
            <Button>Edit Profile</Button>
            <Button variant="outline">
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex gap-6 mb-4">
          <div className="text-center">
            <div className="font-bold text-gray-900">{PROFILE_DATA.stats.projects}</div>
            <div className="text-sm text-gray-600">Projects</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-gray-900">{PROFILE_DATA.stats.connections}</div>
            <div className="text-sm text-gray-600">Connections</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-gray-900">{PROFILE_DATA.stats.collaborations}</div>
            <div className="text-sm text-gray-600">Collaborations</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            {PROFILE_DATA.location}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <LinkIcon className="w-4 h-4" />
            <a href={`https://${PROFILE_DATA.website}`} className="text-red-600 hover:underline">
              {PROFILE_DATA.website}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileInfo() {
  return (
    <div className="px-6 py-4 border-t border-gray-200">
      <div className="mb-4">
        <h2 className="font-bold text-gray-900 mb-1">Department</h2>
        <p className="text-gray-600">{PROFILE_DATA.department} • {PROFILE_DATA.year}</p>
      </div>
      
      <div className="mb-4">
        <h2 className="font-bold text-gray-900 mb-1">Bio</h2>
        <p className="text-gray-600">{PROFILE_DATA.bio}</p>
      </div>
      
      <div>
        <h2 className="font-bold text-gray-900 mb-2">Interests</h2>
        <div className="flex flex-wrap gap-2">
          {PROFILE_DATA.interests.map((interest) => (
            <span
              key={interest}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function StartupMoments() {
  return (
    <div className="border-t border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Startup Moments</h2>
          <Button variant="ghost" size="sm">
            <Camera className="w-4 h-4 mr-2" />
            Add Moment
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {PROFILE_DATA.moments.map((moment) => (
            <div
              key={moment.id}
              className="aspect-square relative group cursor-pointer overflow-hidden rounded-lg"
            >
              <img
                src={moment.image}
                alt={moment.title}
                className="object-cover w-full h-full transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                <p className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {moment.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm mb-16 md:mb-0">
      <ProfileHeader />
      <ProfileInfo />
      <StartupMoments />
    </div>
  );
}

export default ProfilePage;