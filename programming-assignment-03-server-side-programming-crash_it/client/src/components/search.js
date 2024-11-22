import React, { useState, useEffect } from 'react';
import {
  displayNewestPosts,
  displayOldestPosts,
  displayActivePosts,
  countTotalComments
} from '../components/helperFunctions'; 
import formatTimestamp from '../components/helperFunctions';

export function SearchResults({ filteredPosts, searchQuery, Mcommunities, Mlinkflairs, Mcomments, Mposts, onSelectPost }) {
  const [posts, setPosts] = useState(filteredPosts);
  const [sortOption, setSortOption] = useState(''); // Track the current sort option

  // // Update posts when filteredPosts or sortoption or model data changes
  useEffect(() => {
    let sortedPosts = [...filteredPosts]; // Create a copy of the posts
    switch (sortOption) {
      case 'newest':
        sortedPosts = displayNewestPosts(sortedPosts);
        break;
      case 'oldest':
        sortedPosts = displayOldestPosts(sortedPosts);
        break;
      case 'active':
        sortedPosts = displayActivePosts(sortedPosts, Mcomments);
        break;
      default:
        sortedPosts = displayNewestPosts(sortedPosts);
        break;
    }
    setPosts(sortedPosts); // Update state with sorted posts
  },[Mposts, Mcomments, sortOption, filteredPosts]);

  return (
    <div className="search-results">
      <div className="header-container">
          <h2 className="header">
          {posts.length > 0 ? `Results for: "${searchQuery}"` : `No results found for: "${searchQuery}"`}
          </h2>
          <div id="sort-options">
              <button onClick={() => setSortOption('newest')}>Newest</button>
              <button onClick={() => setSortOption('oldest')}>Oldest</button>
              <button onClick={() => setSortOption('active')}>Active</button>
          </div>
      </div>

      <h4>{posts.length} posts found</h4>

      {posts.length > 0 ? (
        <div id="post-lists">
          {posts.map((post) => (
            <div key={post._id} className="post-item" onClick={() => onSelectPost(post._id)}>
                <p className='post-meta'>
                    Community: {Mcommunities.find((community) => community.postIDs.includes(post._id)).name} |
                    Posted by: {post.postedBy} | Created: {formatTimestamp(new Date(post.postedDate))}</p>
                <h3>{post.title}</h3>
                <p className="flair">{
                    post.linkFlairID? 
                    Mlinkflairs.find((flair) => flair._id === post.linkFlairID).content
                    :
                    ''
                    }
                </p>
                <p>{post.content.slice(0,80)}...</p>
                <p>Views: {post.views} | Comments: {countTotalComments(Mcomments, post.commentIDs)}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>No matching posts found.</div>
      )}
    </div>
  );
}
