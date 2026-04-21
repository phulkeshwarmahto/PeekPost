const getConversationName = (conversation, currentUserId) => {
  if (conversation.name) return conversation.name;

  const partner = conversation.participants?.find((participant) => participant._id !== currentUserId);
  return partner?.fullName || partner?.username || "Conversation";
};

const ChatList = ({ conversations = [], activeConversationId, onSelect, currentUserId }) => (
  <aside className="ig-chat-list">
    <div className="ig-chat-list-head">
      <span>upvox_</span>
      <span>?</span>
    </div>

    <div className="ig-chat-tabs">
      <span className="ig-chat-tab active">Primary</span>
      <span className="ig-chat-tab">General</span>
    </div>

    <div style={{ overflowY: "auto" }}>
      {conversations.map((conversation) => {
        const partner = conversation.participants?.find((participant) => participant._id !== currentUserId);

        return (
          <button
            key={conversation._id}
            type="button"
            className={`ig-chat-item${conversation._id === activeConversationId ? " active" : ""}`}
            onClick={() => onSelect(conversation._id)}
          >
            <img
              className="ig-chat-avatar"
              src={partner?.avatar || "https://placehold.co/80x80?text=U"}
              alt={partner?.username || "user"}
            />
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{getConversationName(conversation, currentUserId)}</div>
              <div className="ig-muted">Active 2h ago</div>
            </div>
          </button>
        );
      })}
    </div>
  </aside>
);

export default ChatList;