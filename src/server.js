const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Health check for ALB
app.get('/health', (req, res) => {
    res.status(200).send('ok');
});

const path = require('path');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../public')));

// Example API route
app.get('/api/hello', (req, res) => {
    res.send('Hello from the API!');
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`API running on port ${PORT}`);
});
