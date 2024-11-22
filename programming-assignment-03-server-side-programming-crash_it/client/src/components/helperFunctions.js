

export default function formatTimestamp(timestamp)
{
  const date = new Date(timestamp);
  const now = Date.now();
  const difference = now - date.getTime();

  //convert milliseconds to seconds
  const seconds = Math.floor(difference/1000);
  if (seconds < 60) return `${seconds} seconds ago`;

  const minutes = Math.floor(seconds/60);
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes/60);
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours/24);
  if (days < 30) return `${days} days ago`;

  const months = Math.floor(days/30);
  if (months < 12) return `${months} months ago`;

  const years = Math.floor(months/12);
  return `${years} years ago`;
}

// Helper function to get posts by IDs
export function getPostsByIDs(Mposts,postIDs) {
    if (postIDs) return postIDs.map(id => Mposts.find(post => post._id === id)).filter(Boolean);
    return [];
}

// Helper function to get comments by IDs
function getCommentsByIDs(comments,commentIDs) {
    return commentIDs.map(id => comments.find(comment => comment._id === id)).filter(Boolean);
}

// Sort posts by newest first
export function displayNewestPosts(posts, Mposts=null, Mcommunities=null, currentCommunityID=null) {
    if (currentCommunityID === null) {
        return posts.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    } 
    else {
        const community = Mcommunities.find(community => community.url === currentCommunityID);
        const communityPosts = getPostsByIDs(Mposts, community.postIDs);
        return communityPosts.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    }
}

// Sort posts by oldest first
export function displayOldestPosts(posts, Mposts=null, Mcommunities=null, currentCommunityID=null) {
    if (currentCommunityID === null) {
        return posts.sort((a, b) => new Date(a.postedDate) - new Date(b.postedDate));
    } 
    else {
        const community =Mcommunities.find(community => community.url === currentCommunityID);
        const communityPosts = getPostsByIDs(Mposts, community.postIDs);
        return communityPosts.sort((a, b) => new Date(a.postedDate) - new Date(b.postedDate));
    }
}
  // Sort posts by the most recent comments from the 'most active'
export function displayActivePosts(posts, Mcomments, Mposts=null, Mcommunities=null, currentCommunityID=null) {
    // Helper function to find the most recent comment date from a post's comments
    function getMostRecentCommentDate(post) {
        const comments = getCommentsByIDs(Mcomments, post.commentIDs);
        return comments.reduce((latest, comment) => {
            return new Date(comment.commentedDate) > latest ? new Date(comment.commentedDate) : latest;
        }, new Date(0)); // Default to earliest date
    }

    if (currentCommunityID === null) {
        return posts.sort((a, b) => getMostRecentCommentDate(b) - getMostRecentCommentDate(a));
    } 
    else {
        const community = Mcommunities.find(community => community.url === currentCommunityID);
        const communityPosts = getPostsByIDs(Mposts, community.postIDs);
        return communityPosts.sort((a, b) => getMostRecentCommentDate(b) - getMostRecentCommentDate(a));
    }
  }
  
export function countTotalComments( Mcomments, commentIDs )
{
    let count = 0;

    if(!commentIDs) return count;

    commentIDs.forEach(_id => {
        const comment = Mcomments.find(c => c._id === _id);
        if (comment)
        {
            count += 1; //count current comment
            count += countTotalComments(Mcomments, comment.commentIDs); //add nested replies
        }
    });
    return count; //return total count
}
