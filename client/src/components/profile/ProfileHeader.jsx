const ProfileHeader = ({ profile, postsCount, isOwnProfile }) => (
  <section className="ig-profile-header">
    <div style={{ position: 'relative' }}>
      <img
        className="ig-profile-avatar"
        src={profile.avatar || "https://placehold.co/220x220?text=Avatar"}
        alt={profile.username}
      />
    </div>

    <div className="ig-profile-meta">
      <div className="ig-profile-row">
        <div className="ig-profile-username" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {profile.username}
          {!isOwnProfile && (
            <svg aria-label="Verified" fill="var(--ig-blue)" height="18" role="img" viewBox="0 0 40 40" width="18">
              <title>Verified</title>
              <path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" fillRule="evenodd"></path>
            </svg>
          )}
        </div>
        
        {isOwnProfile ? (
          <>
            <button className="ig-profile-btn" style={{ fontWeight: 600, background: '#efefef' }} type="button">
              Edit profile
            </button>
            <button className="ig-profile-btn" style={{ fontWeight: 600, background: '#efefef' }} type="button">
              Ad tools
            </button>
            <button className="ig-profile-btn" style={{ background: 'transparent', padding: '0 8px', fontSize: 20 }} type="button">
              &#9881;
            </button>
          </>
        ) : (
          <>
            <button className="ig-profile-btn" style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, background: '#efefef' }} type="button">
              Following <span style={{ fontSize: 10 }}>&#9660;</span>
            </button>
            <button className="ig-profile-btn" style={{ fontWeight: 600, background: '#efefef' }} type="button">
              Message
            </button>
            <button className="ig-profile-btn" style={{ fontWeight: 600, background: '#efefef', padding: '8px 12px' }} type="button">
              +<span style={{ fontSize: 16 }}>&#x1F464;</span>
            </button>
            <span style={{ fontSize: 20, cursor: 'pointer' }}>...</span>
          </>
        )}
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