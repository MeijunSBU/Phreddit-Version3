import React, { useState } from 'react'
import axios from 'axios';

export default function NewCommentPage({ Mposts, Mcomments, setMcomments, postID, parentCommentID = null, onNavigate, setLoading })
{
    const [content, setContent] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const validateInputs = () => 
    {
        if (!content.trim() || content.length > 500)
            return 'Content must be between 1 and 500 characters.';
        if (!username.trim())
            return 'Username is required.';
        return '';
    }

    const handleSubmit = async () =>
    {
        const validationError = validateInputs();
        if (validationError)
        {
            setError(validationError);
            return;
        }

        const post = Mposts.find(post => post._id === postID);

        // create new comment object
        const newComment = 
        {
            content: content.trim(),
            commentIDs: [], 
            commentedBy: username.trim(),
            commentedDate: Date.now()
        }

        // add the new comment object to server data
        try {
            setLoading(true);
            
            // post the new comment to server side
            const commentRes = await axios.post('http://localhost:8000/api/comments', newComment);
            const newCommentData = commentRes.data;

            // update Model comments at client side with new post
            setMcomments([...Mcomments, newCommentData]);

            if (parentCommentID)
            {
                //add a reply to another comment
                const parentComment = Mcomments.find(comment => comment._id === parentCommentID);
                
                parentComment.commentIDs.push(newCommentData._id);

                // update model parent comment ID
                axios.post(`http://localhost:8000/api/comments/${parentCommentID}/commentIDs`, {  newCommentID: newCommentData._id });
                
            }
            else
            {
                // add new comment to specific post at server side
                await axios.post(`http://localhost:8000/api/posts/${postID}/commentIDs`, {
                    commentID: newCommentData._id
                })

                //add new comment to specific post at client side
                if (post) post.commentIDs.push(newCommentData._id);
            }

            // when we change the view back to postpage, the view is automatically incremented
            // - 1 to prevent views increase
            // decrease views in the database
            axios.post(`http://localhost:8000/api/posts/${postID}/views`, { decide: 1 });

            // decrease at client side
            post.views -= 1; 

            //Navigate back to the post page
            onNavigate('post');

        }  catch (err) {
            console.error('Error creating new comment: ', err);
            setError('Failed to create comment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='new-comment-page'>
            <h2>{parentCommentID? 'Reply to Comment' : 'Add a Comment'}</h2>

            <div className='comment-form'>
                <label htmlFor="comment-content">Comment Content:</label>
                <textarea id="comment-content" value={content}
                    onChange={(s) => setContent(s.target.value)}
                    placeholder='Enter comment'
                    maxLength={500}
                    required />
                {error.includes('Content') && <p className='error-message'>{error}</p>}

                <br />

                <label htmlFor='comment-username'>Username:</label>
                <input type='text' id='comment-username' value={username}
                    onChange={(s) => setUsername(s.target.value)}
                    placeholder='Enter your username'
                    required />
                {error.includes('Username') && <p className='error-message'>{error}</p>}

                <br/>

                <button onClick={handleSubmit}>Submit Comment</button>
            </div>
        </div>
    );
}