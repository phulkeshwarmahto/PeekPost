const MessageBubble = ({ message, own }) => {
  if (message.typing) {
    return (
      <div className="ig-msg-row">
        <img className="ig-msg-avatar" src={message.sender?.avatar || "https://placehold.co/40x40?text=U"} alt="avatar" />
        <div className="ig-msg-typing">
          <div className="ig-msg-typing-dots">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`ig-msg-row ${own ? "own" : ""}`}>
      {!own && (
        <img
          className="ig-msg-avatar"
          src={message.sender?.avatar || "https://placehold.co/40x40?text=U"}
          alt="avatar"
        />
      )}
      
      <div style={{ display: "flex", flexDirection: "column", maxWidth: "75%" }}>
        {message.media && (
          <div className="ig-msg-img" style={{ marginBottom: message.text ? 4 : 0 }}>
            <img src={message.media} alt="attachment" />
          </div>
        )}
        
        {message.text && (
          <div className={`ig-msg-bubble ${own ? "own" : "received"}`}>
            {message.text}
          </div>
        )}

        {message.seen && own && (
          <div className="ig-msg-seen">Seen</div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;