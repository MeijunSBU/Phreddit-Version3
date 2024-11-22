import React, { useState } from 'react';
import axios from 'axios';

export default function NewPostPage({ onNavigate, Mposts, Mlinkflairs, Mcommunities, setMposts, setMlinkflairs })
{
    // const [communities, setCommunities] = useState([]);
    // const [linkFlairs, setLinkFlairs] = useState([]);

    const [selectedCommunity, setSelectedCommunity] = useState('');
    const [selectedFlair, setSelectedFlair] = useState('');
    const [newFlair, setNewFlair] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    // // Load available communities and link flairs from server when component mounts
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const [coummunitiesRes, linkflairRes] = await Promise.all([
    //                 axios.get('http://localhost:8000/api/communities'),
    //                 axios.get('http://localhost:8000/api/linkflairs')
    //             ]);
    //             setCommunities(coummunitiesRes.data);
    //             setLinkFlairs(linkflairRes.data);
    //         }catch (err) {
    //             console.error('Error fetching data: ', error);
    //         }
    //     }
    //     fetchData();
    // }, []); 
    //using useEffect ensures the component stays in sync with any updates 

    const validateForm = () => 
    {
        if (!selectedCommunity) return 'Selection of a community is required.';
        if (title.trim() === '' || title.length > 100) return 'Title is required and must be under 100 characters.';
        if (newFlair.length > 30) return 'New link flair must be under 30 characters.';
        if (content.trim() === '') return 'Content is required.';
        if (username.trim() === '') return 'Username is required.';
        if (selectedFlair && newFlair) return 'You can only apply one link flair.';
        return '';
    }
    
    const handleSubmit = async () => {

        const validationError = validateForm();
        if (validationError)
        {
            setError(validationError);
            return;
        }


        if (newFlair)
        {
            try {
                const flairResponse = await axios.post('http://localhost:8000/api/linkflairs', {
                    content: newFlair,
                });
                setMlinkflairs([...Mlinkflairs, flairResponse.data]); // add the new linkflair to the linkFlairs
                setSelectedFlair(flairResponse.data._id);
            } catch (err) {
                console.error('Error creating new flair: ', err);
                setError('Failed to create new flair.');
                return;
            }
        }

        let flairID = selectedFlair;


        const newPost = {
            title: title,
            content: content,
            postedBy: username,
            postedDate: new Date(),
            linkFlairID: flairID || null,
            communityID: selectedCommunity,
            views: 0,
            commentIDs: []
        };

        try {
            // post the new post to server side
            const postRes = await axios.post('http://localhost:8000/api/posts', newPost);
            const newPostId = postRes.data._id;

            // update Model posts at client side with new post
            setMposts([...Mposts, postRes.data]);

            // //Update the community's postIDs on server side
            // await axios.post(`http://localhost:8000/api/communities/${selectedCommunity}/postIDs`, {
            //     postId: newPostId
            // })

            //add new post to selected community at client side
            const community = Mcommunities.find(community => community._id === selectedCommunity);
            if (community) community.postIDs.push(newPostId);

            onNavigate('home');
        }  catch (err) {
            console.error('Error creating new post or updating community: ', err);
            setError('Failed to create post or update community.');
            return;
        }
    };

    return (
        <div id="new-post-form" className="new-post-page">
            <h2>Create New Post</h2>

            <label>Community</label>
            <select value={selectedCommunity} onChange={(s) => setSelectedCommunity(s.target.value)}>
                <option value="">Select a community</option>
                {
                    Mcommunities.map((community) => (
                        <option key={community._id} value={community._id}>
                            {community.name}
                        </option>
                    ))
                }
            </select>
            {error.includes('community') && <p className='error-message'>{error}</p>}

            <label>Title</label>
            <input 
            type="text" value={title} 
            onChange={(s) => setTitle(s.target.value)}
            placeholder="Enter post title" maxLength={100} required
            />
            {error.includes('Title') && <p className='error-message'>{error}</p>}

            <label>Link Flair (Optional)</label>
            <select value={selectedFlair} onChange={(s) => setSelectedFlair(s.target.value)}>
                <option value="">None</option>
                {
                    Mlinkflairs.map((linkFlair) => (
                        <option key={linkFlair._id} value={linkFlair._id}>
                            {linkFlair.content}
                        </option>
                    ))
                }
            </select>

            <label>Or Add New Link Flair (Optional)</label>
            <input 
                type="text"
                value={newFlair}
                onChange={(s) => setNewFlair(s.target.value)}
                placeholder='Enter new link flair'
                maxLength={30}
            />
            {error.includes('link') && <p className='error-message'>{error}</p>}

            <label>Content</label>
            <textarea 
                value={content}
                onChange={(s) => setContent(s.target.value)}
                placeholder='Enter post content'
                required
            />
            {error.includes('Content') && <p className='error-message'>{error}</p>}

            <label>Username</label>
            <input 
                type="text"
                value={username}
                onChange={(s) => setUsername(s.target.value)}
                placeholder='Enter your username'
                required
            />
            {error.includes('name') && <p className='error-message'>{error}</p>}

            <button onClick={handleSubmit}>Submit Post</button>
        </div>
    );
}