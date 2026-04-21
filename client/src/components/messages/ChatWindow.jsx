import MessageBubble from "./MessageBubble";

const ChatWindow = ({ messages = [], draft, onDraftChange, onSend }) => (
  <section className="card" style={{ display: "grid", gap: "0.6rem" }}>
    <h3 style={{ marginTop: 0 }}>Conversation</h3>
    <div style={{ display: "grid", gap: "0.4rem", maxHeight: 360, overflowY: "auto" }}>
      {messages.map((message) => (
        <MessageBubble key={message._id} message={message} />
      ))}
    </div>
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <input
        className="input"
        value={draft}
        placeholder="Type a message"
        onChange={(event) => onDraftChange(event.target.value)}
      />
      <button className="btn-primary" type="button" onClick={onSend}>
        Send
      </button>
    </div>
  </section>
);

export default ChatWindow;