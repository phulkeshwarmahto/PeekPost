const MessageBubble = ({ message }) => (
  <div style={{ background: "#f2f4ff", padding: "0.6rem", borderRadius: 10 }}>
    <strong>{message.sender?.username || "You"}</strong>
    <p style={{ margin: "0.2rem 0 0" }}>{message.text}</p>
  </div>
);

export default MessageBubble;