const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  startConversation,
  getConversationHistory,
  sendMessage,
  getConversationById,
  renameConversation,
  deleteConversation,
} = require("../controllers/chatController");

// Health Check
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Chat Routes Working"
  });
});

// Start Conversation
router.post("/start", verifyToken, startConversation);

// Conversation History
router.get("/history", verifyToken, getConversationHistory);

// Send Message
router.post("/message", verifyToken, sendMessage);

// Rename Conversation
router.patch("/:id/rename", verifyToken, renameConversation);

// Delete Conversation
router.delete("/:id", verifyToken, deleteConversation);

// Get Conversation by ID
router.get("/:id", verifyToken, getConversationById);

module.exports = router;