const ProfileHeader = ({ profile, postsCount }) => (
  <section className="ig-profile-header">
    <div>
      <img
        className="ig-profile-avatar"
        src={profile.avatar || "https://placehold.co/220x220?text=Avatar"}
        alt={profile.username}
      />
    </div>

    <div className="ig-profile-meta">
      <div className="ig-profile-row">
        <div className="ig-profile-username">{profile.username}</div>
        <button className="ig-profile-btn" type="button">
          Edit profile
        </button>
        <button className="ig-profile-btn" type="button">
          Ad tools
        </button>
        <button className="ig-profile-btn" type="button">
          ?
        </button>
      </div>

      <div className="ig-profile-stats">
        <span>
          <strong>{postsCount}</strong> posts
        </span>
        <span>
          <strong>{profile.followersCount}</strong> followers
        </span>
        <span>
          <strong>{profile.followingCount}</strong> following
        </span>
      </div>

      <div className="ig-profile-bio">
        <strong>{profile.fullName || profile.username}</strong>
        <div className="ig-muted">Product/service</div>
        <div>{profile.bio || "Your favourite fun clips in your language."}</div>
        <a className="ig-link" href={profile.website || "https://upvox.net"} target="_blank" rel="noreferrer">
          {profile.website || "upvox.net"}
        </a>
      </div>
    </div>
  </section>
);

export default ProfileHeader;