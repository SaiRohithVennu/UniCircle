import { useEffect, useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Send, X, Loader, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/stores/chat-store';
import { Avatar } from '@/components/ui/avatar';
import { useForm } from 'react-hook-form';

interface MessageFormData {
  content: string;
}

const SAMPLE_MESSAGES = [
  {
    id: '1',
    content: "Looking for a frontend developer with React experience for my AI study scheduler project! Anyone from UC's CS department interested? 🚀 #WebDev #AI",
    sender: {
      name: "Alex Chen",
      avatar_url: "https://images.unsplash.com/photo-1633332755192-727a05c4013d",
      university: "University of Cincinnati",
      department: "Computer Science"
    },
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 minutes ago
  },
  {
    id: '2',
    content: "Need a UI/UX designer for an environmental monitoring app. Great opportunity for Digital Arts students! DM if interested 🎨 #Design #Sustainability",
    sender: {
      name: "Sarah Patel",
      avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      university: "University of Cincinnati",
      department: "Environmental Engineering"
    },
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
  },
  {
    id: '3',
    content: "Looking for ML enthusiasts to collaborate on a healthcare data analysis project. Knowledge of Python required! #DataScience #Healthcare",
    sender: {
      name: "David Kim",
      avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      university: "Ohio State University",
      department: "Data Science"
    },
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString() // 45 minutes ago
  },
  {
    id: '4',
    content: "Seeking 3D modelers and animators for an interactive campus tour project. Perfect for Digital Arts students! #3D #Animation",
    sender: {
      name: "Emily Rodriguez",
      avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      university: "University of Cincinnati",
      department: "Digital Arts"
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1 hour ago
  }
];

const UNIVERSITIES = [
  'All Universities',
  'University of Cincinnati',
  'Ohio State University',
  'Miami University',
  'Xavier University',
  'Northern Kentucky University'
];

export function ChatBox() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isOpen, loading, error, subscribe, unsubscribe, sendMessage, toggleChat } = useChatStore();
  const { register, handleSubmit, reset } = useForm<MessageFormData>();
  const [selectedUniversity, setSelectedUniversity] = useState('All Universities');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (isOpen) {
      subscribe();
    }
    return () => unsubscribe();
  }, [isOpen, subscribe, unsubscribe]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [SAMPLE_MESSAGES]);

  const filteredMessages = SAMPLE_MESSAGES.filter(msg => 
    selectedUniversity === 'All Universities' || 
    msg.sender.university === selectedUniversity
  );

  const onSubmit = async (data: MessageFormData) => {
    try {
      await sendMessage(data.content);
      reset();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 w-80 bg-white rounded-lg shadow-lg flex flex-col max-h-[500px] border border-gray-200 z-50">
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Community Chat</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="hover:bg-gray-100 p-1 h-auto"
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleChat}
            className="hover:bg-gray-100 p-1 h-auto"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="p-3 border-b border-gray-200">
          <select
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {UNIVERSITIES.map((uni) => (
              <option key={uni} value={uni}>{uni}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="h-6 w-6 animate-spin text-orange-600" />
          </div>
        ) : error ? (
          <div className="text-center text-orange-600 py-4">{error}</div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No messages yet. Start the conversation!
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div key={msg.id} className="flex items-start space-x-3">
              <Avatar 
                src={msg.sender.avatar_url} 
                alt={msg.sender.name} 
                size="sm" 
              />
              <div className="flex-1">
                <div className="flex items-baseline space-x-2">
                  <span className="font-medium text-sm text-gray-900">
                    {msg.sender.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-1">
                  {msg.sender.department} • {msg.sender.university}
                </p>
                <p className="text-gray-700 text-sm">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-3 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            {...register('content', { required: true })}
            placeholder="Type a message..."
            className="flex-1 min-w-0 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <Button type="submit" size="sm" className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}