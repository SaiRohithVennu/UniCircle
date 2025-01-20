import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender: {
    name: string;
    avatar_url: string | null;
  };
  created_at: string;
}

interface ChatState {
  messages: Message[];
  isOpen: boolean;
  loading: boolean;
  error: string | null;
  subscribed: boolean;
  subscribe: () => void;
  unsubscribe: () => void;
  sendMessage: (content: string) => Promise<void>;
  toggleChat: () => void;
  fetchMessages: () => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => {
  let subscription: ReturnType<typeof supabase.channel> | null = null;

  return {
    messages: [],
    isOpen: false,
    loading: false,
    error: null,
    subscribed: false,

    fetchMessages: async () => {
      try {
        set({ loading: true, error: null });
        
        const { data: messages, error } = await supabase
          .from('messages')
          .select(`
            id,
            content,
            created_at,
            sender_id,
            profiles:sender_id (
              first_name,
              last_name,
              avatar_url
            )
          `)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;

        const formattedMessages = messages.map(msg => ({
          id: msg.id,
          content: msg.content,
          created_at: msg.created_at,
          sender_id: msg.sender_id,
          sender: {
            name: `${msg.profiles.first_name} ${msg.profiles.last_name}`,
            avatar_url: msg.profiles.avatar_url
          }
        }));

        set({ messages: formattedMessages.reverse() });
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        set({ error: error instanceof Error ? error.message : 'Failed to fetch messages' });
      } finally {
        set({ loading: false });
      }
    },

    subscribe: () => {
      if (get().subscribed) return;

      // First fetch existing messages
      get().fetchMessages();

      subscription = supabase
        .channel('public-chat')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages'
          },
          async (payload) => {
            const message = payload.new as Message;
            
            const { data: profile } = await supabase
              .from('profiles')
              .select('first_name, last_name, avatar_url')
              .eq('id', message.sender_id)
              .single();

            if (profile) {
              const formattedMessage = {
                ...message,
                sender: {
                  name: `${profile.first_name} ${profile.last_name}`,
                  avatar_url: profile.avatar_url
                }
              };

              set((state) => ({
                messages: [...state.messages, formattedMessage]
              }));
            }
          }
        )
        .subscribe();

      set({ subscribed: true });
    },

    unsubscribe: () => {
      if (subscription) {
        supabase.removeChannel(subscription);
        subscription = null;
        set({ subscribed: false });
      }
    },

    sendMessage: async (content: string) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
          .from('messages')
          .insert([{
            content,
            sender_id: user.id
          }]);

        if (error) throw error;
      } catch (error) {
        console.error('Failed to send message:', error);
        throw error;
      }
    },

    toggleChat: () => set((state) => ({ isOpen: !state.isOpen }))
  };
});