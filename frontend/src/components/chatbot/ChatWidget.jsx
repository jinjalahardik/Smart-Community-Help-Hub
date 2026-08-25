import { ChatProvider } from './ChatContext';
import ChatButton from './ChatButton';
import ChatWindow from './ChatWindow';

/**
 * Mount this once near the root of the app (outside/alongside routed
 * content) so the floating assistant persists across every route without
 * needing to touch individual pages or layouts.
 */
export default function ChatWidget() {
  return (
    <ChatProvider>
      <ChatButton />
      <ChatWindow />
    </ChatProvider>
  );
}
