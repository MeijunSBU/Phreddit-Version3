// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Routes
const communityRoutes = require('./routes/communityRoutes');
const postRoutes = require('./routes/postRoutes'); 
const commentRoutes = require('./routes/commentRoutes');  
const linkFlairRoutes = require('./routes/linkFlairRoutes');  

const app = express();
app.use(express.json());
app.use(cors());

// db address
const mongodb = "mongodb://127.0.0.1:27017/phreddit";

// connect mongoose api to MongoDB instance
mongoose.connect(mongodb);

let db = mongoose.connection;

app.get("/", function (req, res) {
    res.send("Hello Phreddit!");
});


// Define an API route to get all communities
app.use('/api/communities', communityRoutes); // Mount the community routes


// Define an API route to get all posts
app.use('/api/posts', postRoutes);

// Define an API route to get all comments
app.use('/api/comments', commentRoutes);

// Define an API route to get all linkflairs
app.use('/api/linkflairs', linkFlairRoutes);

app.listen(8000, () => {console.log("Server listening on port 8000...");});

// shutdown code to handle server termination
process.on('SIGINT', async () => {
    await mongoose.connection.close(); // close MongoDB connection when server is stopped
    console.log('Server closed. Database instance disconnected.');
    process.exit(0);
});
