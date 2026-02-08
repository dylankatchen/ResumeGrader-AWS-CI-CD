const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Health check for ALB
app.get('/health', (req, res) => {
    res.status(200).send('ok');
});

// Example API route
app.get('/', (req, res) => {
    res.send('Hello World! This is finally works lets goooo!');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`API running on port ${PORT}`);
});
