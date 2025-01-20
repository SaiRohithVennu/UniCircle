import { useState, useEffect } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Repeat2, Share2, Building2, Loader } from 'lucide-react';

interface FeedItem {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    university: string;
    type: 'student' | 'company';
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timeAgo: string;
}

const SAMPLE_FEED: FeedItem[] = [
  {
    id: '1',
    author: {
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d',
      role: 'Computer Science Student',
      university: 'University of Cincinnati',
      type: 'student'
    },
    content: 'Just wrapped up an amazing AI project that helps students organize their study schedules more effectively. Looking for beta testers! 🚀 #AI #StudentLife #Innovation',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
    likes: 42,
    comments: 8,
    shares: 3,
    timeAgo: '2h'
  },
  {
    id: '2',
    author: {
      name: 'Sarah Patel',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      role: 'Software Engineering Student',
      university: 'University of Cincinnati',
      type: 'student'
    },
    content: 'Excited to share that our team won first place at the UC Hackathon! Our project focused on sustainable campus solutions using IoT sensors. Thanks to everyone who supported us! 🏆 #UCHackathon #Innovation',
    likes: 156,
    comments: 23,
    shares: 12,
    timeAgo: '3h'
  },
  {
    id: '3',
    author: {
      name: 'TechStart Labs',
      avatar: 'https://via.placeholder.com/40',
      role: 'Software Development Company',
      university: '',
      type: 'company'
    },
    content: 'We\'re excited to announce our Summer 2024 Internship Program! Looking for passionate UC students interested in full-stack development and AI. Apply now! 🌟 #Internship #TechCareers',
    likes: 89,
    comments: 15,
    shares: 24,
    timeAgo: '4h'
  },
  {
    id: '4',
    author: {
      name: 'EcoSolutions',
      avatar: 'https://via.placeholder.com/40',
      role: 'Environmental Tech Company',
      university: '',
      type: 'company'
    },
    content: 'Join our team! We\'re looking for innovative minds passionate about sustainable technology. Great opportunity for Environmental Engineering students! 🌱 #GreenTech #Sustainability',
    likes: 65,
    comments: 12,
    shares: 18,
    timeAgo: '5h'
  }
];

export function FeedList() {
  const [loading, setLoading] = useState(true);
  const [feed, setFeed] = useState<FeedItem[]>([]);

  useEffect(() => {
    // Simulate loading feed data
    const loadFeed = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        // Sort feed to show student posts first
        const sortedFeed = [...SAMPLE_FEED].sort((a, b) => {
          if (a.author.type === b.author.type) return 0;
          return a.author.type === 'student' ? -1 : 1;
        });
        setFeed(sortedFeed);
      } finally {
        setLoading(false);
      }
    };

    loadFeed();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feed.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-sm p-4">
          {/* Author Info */}
          <div className="flex items-center space-x-3 mb-4">
            <Avatar
              src={item.author.avatar}
              alt={item.author.name}
              size="sm"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900">{item.author.name}</h3>
                {item.author.type === 'company' && (
                  <Building2 className="w-4 h-4 text-orange-600" />
                )}
              </div>
              <p className="text-sm text-gray-500">
                {item.author.role}
                {item.author.university && ` • ${item.author.university}`}
                {' • '}{item.timeAgo}
              </p>
            </div>
          </div>

          {/* Content */}
          <p className="text-gray-800 mb-4">{item.content}</p>

          {/* Image */}
          {item.image && (
            <img
              src={item.image}
              alt="Post content"
              className="rounded-lg mb-4 w-full object-cover"
            />
          )}

          {/* Engagement Stats */}
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
            <span>{item.likes} likes</span>
            <span>{item.comments} comments</span>
            <span>{item.shares} shares</span>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between border-t pt-4">
            <Button variant="ghost" className="flex-1">
              <Heart className="w-4 h-4 mr-2" />
              Like
            </Button>
            <Button variant="ghost" className="flex-1">
              <MessageSquare className="w-4 h-4 mr-2" />
              Comment
            </Button>
            <Button variant="ghost" className="flex-1">
              <Repeat2 className="w-4 h-4 mr-2" />
              Repost
            </Button>
            <Button variant="ghost" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}