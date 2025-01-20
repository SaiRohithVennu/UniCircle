import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/stores/chat-store';

export function ChatToggle() {
  const { toggleChat, isOpen } = useChatStore();

  return (
    <Button
      onClick={toggleChat}
      className="fixed bottom-20 right-4 rounded-full shadow-lg md:bottom-4"
      size="lg"
    >
      <MessageCircle className="h-5 w-5 mr-2" />
      {isOpen ? 'Close Chat' : 'Open Chat'}
    </Button>
  );
}