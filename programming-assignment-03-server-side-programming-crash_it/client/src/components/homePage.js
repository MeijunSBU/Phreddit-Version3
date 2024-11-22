import formatTimestamp from './helperFunctions.js';
import { displayNewestPosts, displayOldestPosts, displayActivePosts, countTotalComments } from '../components/helperFunctions.js';
import { useState, useEffect } from 'react';



export default function HomePage({Mposts, Mcommunities,Mcomments, Mlinkflairs, onSelectPost, loading })
{
    const [posts, setPosts] = useState([]); // State for posts
    const [sortOption, setSortOption] = useState('newest'); // Default sort option
    
    //sort post by newest default, whenever Model posts or comments data or sortOption changes
    useEffect(() => {
        let sortedPosts = [...Mposts]; // Create a copy of the posts
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
                sortedPosts = displayNewestPosts(sortedPosts); // default sort by newest
                break;
        }
        setPosts(sortedPosts); // Update state with sorted posts
    }, [sortOption, Mposts, Mcomments]);

    console.log(Mcommunities);
    if (loading || !Mlinkflairs || !Mcommunities || !Mposts || !Mcomments) {
        return <div className="post-controls">Loading...</div>; // Show loading message while fetching
    }

    return(
        <div id="post-controls">
            <div className="header-container">
                <h2 className="header">
                    All Posts
                </h2>
                <div id="sort-options">
                    <button onClick={() => setSortOption('newest')}>Newest</button>
                    <button onClick={() => setSortOption('oldest')}>Oldest</button>
                    <button onClick={() => setSortOption('active')}>Active</button>
                </div>
            </div>
            
            <div id="post-lists">
                {/* {console.log('posts: ',posts)} */}
                {posts.map((post) => {
                    const community = Mcommunities.find((community) => community.postIDs? community.postIDs.includes(post._id): null);
                    console.log(community);
                    const flair = Mlinkflairs.find((f) => f._id === post.linkFlairID);
                    return (
                        <div key={post._id} className="post-item" onClick={() => onSelectPost(post._id)}>
                        <p className='post-meta'>
                            Community: {community ? community.name : ''} |
                            Posted by: {post.postedBy} | Created: {formatTimestamp(new Date(post.postedDate))}</p>
                        <h3>{post.title}</h3>
                        <p className="flair">{
                            flair? 
                            flair.content
                            :
                            ''
                            }
                        </p>
                            <p>{post.content.slice(0,80)}...</p>
                            <p>Views: {post.views} | Comments: {countTotalComments(Mcomments, post.commentIDs)}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
