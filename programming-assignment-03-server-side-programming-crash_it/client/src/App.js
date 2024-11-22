import './css/index.css';
import Phreddit from './components/phreddit.js';
import NavBar from './components/navBar.js';
import HomePage from './components/homePage.js';
import PostPage from './components/postPage.js';
import CommunityPageView from './components/CommunityPageView.js';
import CreateCommunity from './components/CreateCommunity.js';
import { useEffect, useState } from 'react';
import { SearchResults } from './components/search.js';
import NewPostPage from './components/newPostPage.js';
import NewCommentPage from './components/newCommentPage.js';
import axios from 'axios';

function App() {
  const [currentView, setCurrentView] = useState('home'); // Track the current view
  const [selectedCommunity, setSelectedCommunity] = useState(null); // Track the selected community
  const [selectedPostID, setSelectedPostID] = useState(null); // Track the selected post with postID
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [parentCommentID, setParentComentID] = useState('');


  const [loading, setLoading] = useState(true);

  // Fetch posts, comments, and linkflairs when component mounts
  const [Mcommunities, setMcommunities] = useState([]);
  const [Mposts, setMposts] = useState([]);
  const [Mcomments, setMcomments] = useState([]);
  const [Mlinkflairs, setMlinkflairs] = useState([]);

  // Track if data has been fetched
  const [dataFetched, setDataFetched] = useState(false);

  // Fetch data from the API
  useEffect(() => {
    if (!dataFetched)
    {
      const fetchData = async() => {
        try {
          const [communitiesRes, postsRes, commentsRes, linkflairsRes] = await Promise.all([
            axios.get('http://localhost:8000/api/communities'),
            axios.get('http://localhost:8000/api/posts'),
            axios.get('http://localhost:8000/api/comments'),
            axios.get('http://localhost:8000/api/linkflairs')
          ]);

          setMcommunities(communitiesRes.data);
          setMposts(postsRes.data);
          setMcomments(commentsRes.data);
          setMlinkflairs(linkflairsRes.data);
          setDataFetched(true);
        }catch (err) {
          console.error('Error fetching data: ', err);
        } finally {
          setLoading(false); // after all data is fetched, set loading to false
        }
      };

      fetchData();
    }
  }, []);
  
  //fetch all data ids
  Mcommunities.forEach(c => {
    c.url = `/communities/${c._id}`;
  });
  Mposts.forEach(p => {
    p.url = `/posts/${p._id}`;  // Assign a URL for each post
  });
  Mlinkflairs.forEach(lf => {
    lf.url = `/linkflairs/${lf._id}`;  // Assign a URL for each linkflair
  });
  Mcomments.forEach(c => {
    c.url = `/comments/${c._id}`;  // Assign a URL for each comment
  });

  const handleNavigate = (view, data = {}) => {
    setCurrentView(view);

    if (view === 'new-comment-page') {
      setParentComentID(data.parentCommentID || null);
    }

    if (view === 'search') {
      setFilteredPosts(data.filteredPosts || []);
      setSearchQuery(data.query || '');
    }
  };

  const handleSelectPost = (postID) => {
    setSelectedPostID(postID);
    setCurrentView('post');
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage Mposts={Mposts} Mcommunities={Mcommunities} Mcomments={Mcomments} Mlinkflairs = {Mlinkflairs} onSelectPost={handleSelectPost} loading={loading}/>;
      
      case 'community':
        return <CommunityPageView Mcommunities={Mcommunities} Mposts={Mposts}  Mcomments={Mcomments} Mlinkflairs = {Mlinkflairs} communityID={selectedCommunity} onSelectPost={handleSelectPost} />;
      
      case 'createCommunity': // New case for the create community view
        return <CreateCommunity Mcommunities={Mcommunities} setMcommunities={setMcommunities} setCurrentView={setCurrentView} setSelectedCommunity={setSelectedCommunity} />;
      
      case 'search':
        return <SearchResults filteredPosts={filteredPosts} searchQuery={searchQuery}  Mcommunities= {Mcommunities} Mlinkflairs={Mlinkflairs} Mcomments = {Mcomments} Mposts = {Mposts} onSelectPost={handleSelectPost}/>;

      case 'post':
        return <PostPage Mposts={Mposts} Mcomments={Mcomments} Mlinkflairs={Mlinkflairs} Mcommunities={Mcommunities} postID={selectedPostID} onNavigate={handleNavigate}/>

      case 'new-post-page':
        return <NewPostPage onNavigate={handleNavigate} Mposts={Mposts} Mlinkflairs={Mlinkflairs} Mcommunities={Mcommunities} setMposts={setMposts} setMlinkflairs={setMlinkflairs} />

      case 'new-comment-page':
        return <NewCommentPage  Mposts={Mposts} Mcomments={Mcomments} setMcomments={setMcomments} postID={selectedPostID} parentCommentID={parentCommentID} onNavigate={handleNavigate} setLoading={setLoading} />;

      default:
        return <HomePage Mposts={Mposts} Mcommunities={Mcommunities} Mcomments={Mcomments} onSelectPost={handleSelectPost} />;
    }
  };

  return (
    <section className="phreddit">
      <Phreddit Mposts={Mposts} Mcomments={Mcomments} onNavigate={handleNavigate} currentView={currentView}/>
      <div className="container">
        <NavBar 
          Mcommunities={Mcommunities} 
          onNavigate={handleNavigate} 
          currentView={currentView} 
          setCommunityID={setSelectedCommunity} 
          selectedCommunityID={selectedCommunity}
          loading={loading} // Pass loading state to NavBar
        />
        <div className="main">{renderView()}</div>
      </div>
    </section>
  );
}

export default App;
