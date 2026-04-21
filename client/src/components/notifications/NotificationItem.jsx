const prettyType = (type) => {
  switch (type) {
    case "follow":
      return "started following you.";
    case "like":
      return "liked your post.";
    case "comment":
      return "commented on your post.";
    case "dm":
      return "sent you a message.";
    default:
      return type;
  }
};

const NotificationItem = ({ item }) => {
  const isFollow = item.type === "follow" || item.type === "follow_request";

  return (
    <div className="ig-notification-item">
      <img
        className="ig-notification-thumb"
        src={item.actor?.avatar || "https://placehold.co/80x80?text=U"}
        alt={item.actor?.username || "user"}
      />
      <div className="ig-notification-main">
        <strong>{item.actor?.username || "user"}</strong> {item.message || prettyType(item.type)}
      </div>
      {isFollow ? (
        <button className="ig-btn-primary" type="button" style={{ paddingInline: 16 }}>
          Follow
        </button>
      ) : (
        <div style={{ width: 44, height: 44, background: "#c7c7c7" }} />
      )}
    </div>
  );
};

export default NotificationItem;