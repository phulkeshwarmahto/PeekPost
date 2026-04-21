import MessageBubble from "./MessageBubble";

const getConversationName = (conversation, currentUserId) => {
  if (!conversation) return "No conversation selected";
  if (conversation.name) return conversation.name;

  const partner = conversation.participants?.find((participant) => participant._id !== currentUserId);
  return partner?.fullName || partner?.username || "Conversation";
};

const ChatWindow = ({ messages = [], draft, onDraftChange, onSend, currentUserId, activeConversation }) => {
  if (!activeConversation) {
    return (
      <section className="ig-chat-window">
        <div className="ig-chat-head">
          <strong>Messages</strong>
        </div>
        <div className="ig-notification-canvas">
          <div>
            <div style={{ fontSize: 62, marginBottom: 10 }}>?</div>
            <h2 style={{ margin: 0, fontWeight: 500 }}>Your Messages</h2>
            <p className="ig-muted">Send private photos and messages to a friend or group.</p>
            <button className="ig-btn-primary" type="button">
              Send Message
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="ig-chat-window">
      <div className="ig-chat-head">
        <div>
          <div style={{ fontWeight: 700 }}>{getConversationName(activeConversation, currentUserId)}</div>
          <div className="ig-muted" style={{ fontSize: 13 }}>
            Active 2h ago
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 24 }}>
          <span>??</span>
          <span>??</span>
          <span>?</span>
        </div>
      </div>

      <div className="ig-chat-body">
        {messages.map((message) => (
          <MessageBubble key={message._id} message={message} own={message.sender?._id === currentUserId} />
        ))}
      </div>

      <div className="ig-chat-compose">
        <div className="ig-chat-compose-shell">
          <span style={{ fontSize: 22 }}>?</span>
          <input value={draft} placeholder="Message..." onChange={(event) => onDraftChange(event.target.value)} />
          <span style={{ fontSize: 22 }}>??</span>
          <span style={{ fontSize: 22 }}>?</span>
          <button className="ig-link" type="button" style={{ border: 0, background: "transparent" }} onClick={onSend}>
            Post
          </button>
        </div>
      </div>
    </section>
  );
};

export default ChatWindow;