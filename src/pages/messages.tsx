import { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';

export function MessagesPage() {
  return (
    <div className="flex h-screen">
      <div className="w-[350px] border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>
        <div className="overflow-y-auto">
          <div className="p-4 text-center text-gray-500">
            No messages yet
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a conversation to start messaging
      </div>
    </div>
  );
}