const MessageBubble = ({ message, own }) => (
  <div className={`ig-message-row${own ? " own" : ""}`}>
    <div className="ig-message">
      {!own && <div style={{ fontWeight: 700, marginBottom: 4 }}>{message.sender?.username || "User"}</div>}
      <div>{message.text || "Shared a post"}</div>
    </div>
  </div>
);

export default MessageBubble;