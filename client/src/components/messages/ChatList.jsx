import { useMemo } from "react";

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, color: "var(--tcl-muted)" }}>
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);

const getConversationName = (conversation, currentUserId) => {
  if (conversation.name) return conversation.name;
  const partner = conversation.participants?.find((participant) => participant._id !== currentUserId);
  return partner?.fullName || partner?.username || "Conversation";
};

const ChatList = ({ conversations = [], activeConversationId, onSelect, currentUserId }) => {
  /* In case we don't have conversations from API, we inject a mock one to match the design */
  const mockConversations = [
    {
      _id: "mock1",
      participants: [{ _id: "elias", username: "elias_vogel", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" }],
      lastMessage: "That architectural shot is incredible!",
      time: "2m"
    },
    {
      _id: "mock2",
      participants: [{ _id: "sarah", username: "sarah.design", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop" }],
      lastMessage: "Sent a photo",
      time: "1h"
    },
    {
      _id: "mock3",
      participants: [{ _id: "marco", username: "marco_polo", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" }],
      lastMessage: "Are we still shooting tomorrow?",
      time: "5h"
    },
    {
      _id: "mock4",
      participants: [{ _id: "nina", username: "nina_creates", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" }],
      lastMessage: "Liked your message",
      time: "1d"
    },
    {
      _id: "mock5",
      participants: [{ _id: "davide", username: "davide_stills", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" }],
      lastMessage: "Let's collaborate soon.",
      time: "3d"
    }
  ];

  const renderData = conversations.length ? conversations : mockConversations;

  return (
    <aside className="ig-chat-list">
      <div className="ig-chat-list-head">
        <span>Messages</span>
        <button type="button" style={{ color: "var(--tcl-text)" }}><EditIcon /></button>
      </div>

      <div className="ig-chat-search">
        <div className="ig-chat-search-bar">
          <SearchIcon />
          <input type="text" placeholder="Search conversations" />
        </div>
      </div>

      <div className="ig-chat-items">
        {renderData.map((conversation, idx) => {
          const partner = conversation.participants?.find((participant) => participant._id !== currentUserId);
          const isMockActive = !conversations.length && idx === 0;

          return (
            <button
              key={conversation._id}
              type="button"
              className={`ig-chat-item${conversation._id === activeConversationId || isMockActive ? " active" : ""}`}
              onClick={() => onSelect(conversation._id)}
            >
              <div className="ig-chat-avatar">
                <img
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                  src={partner?.avatar || "https://placehold.co/80x80?text=U"}
                  alt={partner?.username || "user"}
                />
                {/* Randomly assign online status to mock data */}
                {(idx === 0) && <div className="ig-online-dot" />}
              </div>
              
              <div className="ig-chat-item-info">
                <div className="ig-chat-item-name">{getConversationName(conversation, currentUserId)}</div>
                <div className="ig-chat-item-preview">{conversation.lastMessage || "Active 2h ago"}</div>
              </div>
              
              <div className="ig-chat-item-time">{conversation.time || ""}</div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default ChatList;