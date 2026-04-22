import NotificationItem from "./NotificationItem";

const NotificationPanel = ({ items = [], onMarkAllRead }) => {
  const unread = items.filter((item) => !item.read);
  const read = items.filter((item) => item.read);

  return (
    <section className="ig-notification-drawer">
      <div className="ig-notification-head">
        <h2 className="ig-notification-title">Notifications</h2>
        <button className="ig-btn-ghost" type="button" onClick={onMarkAllRead}>
          Mark all read
        </button>
      </div>

      <div className="ig-notification-section">
        <h3 className="ig-notification-label">Unread</h3>
        {unread.length === 0 && <p className="ig-muted">All caught up.</p>}
        {unread.map((item) => (
          <NotificationItem key={item._id} item={item} />
        ))}
      </div>

      <div className="ig-notification-section" style={{ borderTop: "1px solid #dbdbdb" }}>
        <h3 className="ig-notification-label">Earlier</h3>
        {read.length === 0 && <p className="ig-muted">No older notifications.</p>}
        {read.map((item) => (
          <NotificationItem key={item._id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default NotificationPanel;