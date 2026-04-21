import PremiumBadge from "../premium/PremiumBadge";

const ProfileHeader = ({ profile }) => (
  <section className="card" style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
    <img
      src={profile.avatar || "https://placehold.co/120x120?text=Avatar"}
      alt={profile.username}
      style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover" }}
    />
    <div>
      <h3 style={{ margin: 0 }}>{`@${profile.username}`}</h3>
      <p style={{ margin: "0.2rem 0" }}>{profile.fullName}</p>
      <p style={{ margin: 0, color: "var(--muted)" }}>{profile.bio}</p>
      <PremiumBadge enabled={profile.premiumBadge} />
    </div>
  </section>
);

export default ProfileHeader;
