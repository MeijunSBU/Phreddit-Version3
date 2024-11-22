import React, { useState, useEffect } from 'react';
import formatTimestamp from './helperFunctions';
import { countTotalComments } from './helperFunctions';

import axios from 'axios';

export default function PostPage({ Mposts, Mcomments, Mlinkflairs, Mcommunities, postID, onNavigate, loading })
{
    const [post, setPost] = useState(null);

    useEffect(() => 
    {
        const selectedPost = Mposts.find((post) => post._id === postID);
        if (selectedPost)
        {
            //increment views in the client
            selectedPost.views += 1;
            setPost(selectedPost);

            // increment views in the database
            axios.post(`http://localhost:8000/api/posts/${postID}/views`)
                .then (response => { setPost(response.data); })
                .catch (error => { console.error('Error updating views count: ', error); });
        }
    }, [postID, Mposts]);

    if (!post) return <div>Post Not Found.</div>;

    if (loading || !Mcomments) return <div>Loading...</div>;
    
    const flair = Mlinkflairs.find((f) => f._id === post.linkFlairID);
    // console.log(Mcomments);
    const comments = post.commentIDs.map((id) => 
        Mcomments.find((comment) => comment._id === id)
    );
    const sortedComments = displayNewestComments(comments);

    const community = Mcommunities.find((community) => 
        community.postIDs.includes(postID)
    );
    
    const totalComments = countTotalComments(Mcomments, post.commentIDs);

    return (
        <div className='post-page'>
            <p>
                Community: {community.name} | {formatTimestamp(new Date(post.postedDate))}
                <br/>
                Posted by: {post.postedBy} 
            </p>
            <h2>{post.title}</h2>
            <p className="flair"> 
                {flair? `${flair.content}`: ''}
            </p>
            <p id="post-content">{post.content}</p>
            <p>
                Views: {post.views} | Comments: {totalComments}
            </p>
            <button id='add-comment' onClick={()=>onNavigate('new-comment-page')}>Add a comment</button>
            <hr className='delimiter'/>
            <div id="comments-list">
                {sortedComments.map((comment) => (
                    <Comment key={comment._id} Mcomments={Mcomments} comment={comment} onNavigate={onNavigate}/>
                ))}
            </div>
        </div>
    );
}

function Comment({ Mcomments, comment, onNavigate })
{
    const replies = comment.commentIDs.map((id) => 
        Mcomments.find((comment) => comment._id === id)
    );
    const sortedReplies = displayNewestComments(replies);

    return (
        <div className='comment-content'>
            <h4>Commented by: {comment.commentedBy} | {formatTimestamp(new Date(comment.commentedDate))}</h4>
            <p className='comment-text'>{comment.content}</p>
            <button className='reply-button' onClick={()=>onNavigate('new-comment-page', {parentCommentID: comment._id})}>Reply</button>
            {replies.length > 0 &&
                <div className='replies'>
                    {sortedReplies.map((reply) => (
                        <Comment key={reply._id} Mcomments={Mcomments} comment={reply} onNavigate={onNavigate}/>
                    ))}
                </div> 
            }
        </div>
    )
}

function displayNewestComments( comments )
{
    return comments.sort((a, b) => new Date(b.commentedDate) - new Date(a.commentedDate));
}

