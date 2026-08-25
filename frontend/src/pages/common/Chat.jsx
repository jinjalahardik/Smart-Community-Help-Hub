import { useState, useMemo, useRef, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import SearchInput from '../../components/ui/SearchInput';
import Avatar from '../../components/ui/Avatar';
import EmptyState from '../../components/ui/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { useChats, useMessages, useSendMessage, useMarkChatRead } from '../../hooks/useChat';
import { timeAgo, formatDateTime } from '../../utils/format';
import { db, STORE_KEYS } from '../../services/mockApi';
import { cn } from '../../utils/cn';

function getOtherParticipant(chat, userId) {
  // Real backend enriches chats with `otherParticipant`; fall back to the
  // mock db lookup for any payload that does not include it.
  if (chat.otherParticipant) return chat.otherParticipant;
  const otherId = chat.participantIds.find((id) => id !== userId);
  const otherUser = db.find(STORE_KEYS.USERS, (u) => u.id === otherId);
  return otherUser || { name: 'Unknown User', id: otherId };
}

export default function Chat() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [activeChatId, setActiveChatId] = useState(null);
  const [draft, setDraft] = useState('');
  const bottomRef = useRef(null);

  const { data: chats = [] } = useChats(user?.id);
  const { data: messages = [] } = useMessages(activeChatId);
  const sendMessage = useSendMessage();
  const markRead = useMarkChatRead();

  const filteredChats = useMemo(
    () => chats.filter((c) => getOtherParticipant(c, user.id).name.toLowerCase().includes(search.toLowerCase())),
    [chats, search, user.id]
  );

  const activeChat = chats.find((c) => c.id === activeChatId);

  useEffect(() => {
    if (!activeChatId && filteredChats.length > 0) setActiveChatId(filteredChats[0].id);
  }, [filteredChats, activeChatId]);

  useEffect(() => {
    if (activeChatId) markRead.mutate({ chatId: activeChatId, userId: user.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!draft.trim() || !activeChatId) return;
    sendMessage.mutate({ chatId: activeChatId, senderId: user.id, text: draft.trim() });
    setDraft('');
  };

  return (
    <div>
      <PageHeader title="Chat" description="Coordinate directly with donors, NGOs and volunteers" breadcrumb={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Chat' }]} />

      <Card className="grid md:grid-cols-[280px_1fr] h-[65vh] min-h-[420px] overflow-hidden">
        <div className="border-r border-teal-100 dark:border-teal-900/50 flex flex-col">
          <div className="p-3 border-b border-teal-100 dark:border-teal-900/50">
            <SearchInput value={search} onChange={setSearch} placeholder="Search conversations..." />
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredChats.length === 0 ? (
              <EmptyState icon={MessageCircle} title="No conversations" className="py-10" />
            ) : (
              filteredChats.map((chat) => {
                const other = getOtherParticipant(chat, user.id);
                const unread = chat.unreadCount?.[user.id] || 0;
                return (
                  <button
                    key={chat.id}
                    onClick={() => setActiveChatId(chat.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 text-left border-b border-teal-50 dark:border-teal-900/30 hover:bg-teal-50/50 dark:hover:bg-teal-900/20',
                      activeChatId === chat.id && 'bg-teal-50 dark:bg-teal-900/40'
                    )}
                  >
                    <Avatar name={other.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{other.name}</p>
                        <span className="text-[10px] text-ink-light/40">{timeAgo(chat.lastMessageAt)}</span>
                      </div>
                      <p className="text-xs text-ink-light/65 dark:text-ink-dark/65 truncate">{chat.lastMessage}</p>
                    </div>
                    {unread > 0 && <span className="w-5 h-5 rounded-full bg-coral-500 text-white text-[10px] flex items-center justify-center shrink-0">{unread}</span>}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="flex flex-col">
          {!activeChat ? (
            <EmptyState icon={MessageCircle} title="Select a conversation" className="h-full justify-center" />
          ) : (
            <>
              <div className="flex items-center gap-3 px-4 py-3 border-b border-teal-100 dark:border-teal-900/50">
                <Avatar name={getOtherParticipant(activeChat, user.id).name} size="sm" />
                <p className="text-sm font-medium">{getOtherParticipant(activeChat, user.id).name}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={cn('flex', m.senderId === user.id ? 'justify-end' : 'justify-start')}>
                    <div className={cn('max-w-[75%] rounded-2xl px-4 py-2.5 text-sm', m.senderId === user.id ? 'bg-teal-600 text-white rounded-br-sm' : 'bg-teal-50 dark:bg-teal-900/40 rounded-bl-sm')}>
                      <p>{m.text}</p>
                      <p className={cn('text-[10px] mt-1', m.senderId === user.id ? 'text-teal-100' : 'text-ink-light/40 dark:text-ink-dark/40')}>{formatDateTime(m.createdAt)}</p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="flex items-center gap-2 p-3 border-t border-teal-100 dark:border-teal-900/50">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  aria-label="Message"
                  className="flex-1 rounded-xl border border-teal-100 dark:border-teal-900/60 bg-white dark:bg-teal-950/40 px-4 py-2.5 text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
                <button onClick={handleSend} aria-label="Send message" className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 hover:bg-teal-700">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
