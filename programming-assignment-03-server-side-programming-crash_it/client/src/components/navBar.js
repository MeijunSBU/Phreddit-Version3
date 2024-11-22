export default function NavBar({ Mcommunities, onNavigate, currentView, setCommunityID, selectedCommunityID, loading }) {
  //  console.log(Mcommunities); // Check what's inside Mcommunity
  //  console.log(Array.isArray(Mcommunities)); // Should log true if Mcommunities is an array
  
    const handleCommunityClick = (id) => {
      setCommunityID(id);
      onNavigate('community');
    };
  
    const isHome = currentView === 'home';
    const isCreateCommunity = currentView === 'createCommunity';
  
    const isOnCommunity = (id) => {
      return selectedCommunityID === id && currentView === 'community';
    };
  
    if (loading) {
      return <div className="navbar">Loading communities...</div>; // Show loading message while fetching
    }
  
    return (
      <div className="navbar">
        <a href='#' className={`home-link ${isHome ? 'active' : ''}`} onClick={() => onNavigate('home')}>Home</a>
        <hr className="delimiter" />
        <h2 className="community-title">Communities</h2>
        <button
          className={`community-button ${isCreateCommunity ? 'active' : ''}`}
          onClick={() => onNavigate('createCommunity')}
        >
          Create Community
        </button>
        {/* List of communities */}
        <ul className="community-list">
          {Array.isArray(Mcommunities) && Mcommunities.length > 0 ? (
            Mcommunities.map((community) => (
              <li key={community._id}>
                <a 
                 className={`community-link ${isOnCommunity(community.url ) ? 'active' : ''}`}
                 onClick={() => handleCommunityClick(community.url)}
                >
                  {community.name}
                </a>
              </li>
            ))
          ) : (
            <li>No communities available.</li>
          )}
        </ul>
      </div>
    );
  }
  
