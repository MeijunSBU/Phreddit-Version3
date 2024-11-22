import React, { useState } from 'react';

export default function Phreddit({ Mposts, Mcomments, onNavigate, currentView }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      const query = searchQuery.trim().toLowerCase();
      const searchTerms = query.split(/\s+/);

      const filteredPosts = Mposts.filter(post => {
        const postTitle = post.title.toLowerCase();
        const postContent = post.content.toLowerCase();

        const postMatches = searchTerms.some(term => 
          postTitle.includes(term) || postContent.includes(term)
        );

        const commentMatches = Mcomments.some(comment => 
          post.commentIDs.includes(comment.commentID) && 
          searchTerms.some(term => comment.content.toLowerCase().includes(term))
        );

        return postMatches || commentMatches;
      });

      // Navigate to the search results page with the filtered posts and the search query
      onNavigate('search', { filteredPosts, query });
    }
  };

  const isNewPost = currentView === 'new-post-page';

  return (
    <div className="banner">
      <a href="#" className="name" onClick={() => onNavigate('home')}>phreddit</a>
      <input
        type="text"
        className="searchbox"
        placeholder="Search Phreddit..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleSearch}
      />
      <button className={`postbutton ${isNewPost? 'active':''}`} 
        onClick={() => onNavigate('new-post-page')}>
        Create Post
      </button>
    </div>
  );
}
