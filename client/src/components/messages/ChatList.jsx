const ChatList = ({ conversations = [], activeConversationId, onSelect }) => (
  <section className="card" style={{ display: "grid", gap: "0.5rem" }}>
    <h3 style={{ marginTop: 0 }}>Chats</h3>
    {conversations.map((conversation) => (
      <button
        key={conversation._id}
        type="button"
        className={conversation._id === activeConversationId ? "btn-primary" : "btn-ghost"}
        onClick={() => onSelect(conversation._id)}
      >
        {conversation.name || conversation.participants.map((participant) => participant.username).join(", ")}
      </button>
    ))}
  </section>
);

export default ChatList;