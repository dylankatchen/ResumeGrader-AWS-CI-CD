const express = require("express");

const app = express();
app.use(express.json());

/**
 * Health check (ECS needs this)
 */
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

/**
 * Example API endpoint
 */
app.get("/hello", (req, res) => {
    res.json({
        message: "Hello from Node.js API this is new"
    });
});

/**
 * Example POST endpoint
 */
app.post("/echo", (req, res) => {
    res.json({
        youSent: req.body
    });
});

/**
 * IMPORTANT:
 * Listen on 0.0.0.0 so Docker/ECS can reach it
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`API running on port ${PORT}`);
});
