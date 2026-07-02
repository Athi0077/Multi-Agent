const express = require("express");
const cors = require("cors");
const dns = require("node:dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://multi-agent-i3d3-nu.vercel.app",
    ],
    credentials: true, 
  })
);
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server Running Successfully"
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

module.exports = app;