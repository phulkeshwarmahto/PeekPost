import NotificationItem from "./NotificationItem";

const NotificationPanel = ({ items = [], onMarkAllRead }) => {
  const yesterday = items.slice(0, 1);
  const thisWeek = items.slice(1, 4);
  const earlier = items.slice(4);

  return (
    <section className="ig-notification-drawer">
      <div className="ig-notification-head">
        <h2 className="ig-notification-title">Notifications</h2>
        <button className="ig-btn-ghost" type="button" onClick={onMarkAllRead}>
          Mark all read
        </button>
      </div>

      <div className="ig-notification-section">
        <h3 className="ig-notification-label">Yesterday</h3>
        {yesterday.length === 0 && <p className="ig-muted">No activity yesterday.</p>}
        {yesterday.map((item) => (
          <NotificationItem key={item._id} item={item} />
        ))}
      </div>

      <div className="ig-notification-section" style={{ borderTop: "1px solid #dbdbdb" }}>
        <h3 className="ig-notification-label">This Week</h3>
        {thisWeek.length === 0 && <p className="ig-muted">No activity this week.</p>}
        {thisWeek.map((item) => (
          <NotificationItem key={item._id} item={item} />
        ))}
      </div>

      <div className="ig-notification-section" style={{ borderTop: "1px solid #dbdbdb" }}>
        <h3 className="ig-notification-label">Earlier</h3>
        {earlier.length === 0 && <p className="ig-muted">No older notifications.</p>}
        {earlier.map((item) => (
          <NotificationItem key={item._id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default NotificationPanel;