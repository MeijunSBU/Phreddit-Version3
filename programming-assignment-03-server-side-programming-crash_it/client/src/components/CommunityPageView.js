import React from 'react';
import {
    displayNewestPosts,
    displayOldestPosts,
    displayActivePosts,
    getPostsByIDs,
    countTotalComments
     } from '../components/helperFunctions'; 
import formatTimestamp from '../components/helperFunctions';// Import helper function
import { useState, useEffect } from 'react';

export default function CommunityPageView({Mcommunities, Mposts, Mcomments, Mlinkflairs, communityID, onSelectPost}) {
   

    //    console.log(Mcommunities); // Check what's inside Mcommunity
    //    console.log(Array.isArray(Mcommunities)); // Should log true if Mcommunities is an array

    

    // Fetch the community details using the communityID directly
    const community = Mcommunities.find(c => c.url=== communityID);
    // console.log(communityID);  
    // console.log(community);

    const [posts, setPosts] = useState([]); // State for posts
    const [sortOption, setSortOption] = useState('newest'); // Default sort option
    
    
    useEffect(() => {
       if(community && community.postIDs){
        
        const composts = getPostsByIDs(Mposts, community.postIDs);
        // Automatically sort posts by "newest" when the component first loads
        let sortedPosts = [...composts]; // Create a copy of the posts
        switch (sortOption) {
            case 'newest':
                sortedPosts = displayNewestPosts(sortedPosts, Mposts, Mcommunities, communityID); // You can pass the community ID if necessary
                break;
            case 'oldest':
                sortedPosts = displayOldestPosts(sortedPosts, Mposts, Mcommunities, communityID);
                break;
            case 'active':
                sortedPosts = displayActivePosts(sortedPosts, Mcomments, Mposts, Mcommunities, communityID);
                break;
            default:
                break;
        }
        setPosts(sortedPosts); // Update state with sorted posts

       }
    }, [communityID, community, sortOption, Mcommunities, Mposts, Mcomments]);

    if (!community) return <div>Loading...</div>;

    return (
        
        <div id="community-page-view">
            <div className='header-container'>
                <h2>{community.name}</h2>
                <div id="sort-options">
                    <button onClick={() => setSortOption('newest')}>Newest</button>
                    <button onClick={() => setSortOption('oldest')}>Oldest</button>
                    <button onClick={() => setSortOption('active')}>Active</button>
                </div>
            </div>
            <p>{community.description}</p>
            <p>Created: {formatTimestamp(community.startDate)}</p>
            <p>Posts: {community.postIDs? community.postIDs.length : 0} | Members: {community.members.length}</p>
        
            {/* Listing of posts */}
            <div id="post-lists">
                {posts.map((post) => (
                    <div key={post._id} className="post-item" onClick={() => onSelectPost(post._id)}>
                        <p className='post-meta'>
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
        </div>
    );
}
