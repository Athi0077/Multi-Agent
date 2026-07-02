const mongoose = require("mongoose");

const User = require("../models/User");
const Conversation = require("../models/Conversation");
const orchestrator = require("../services/orchestrator");
const agentRouter = require("../utils/agentRouter");
const { buildConversationTitle } = require("../utils/conversationTitle");

const handleServerError = (res, error, context) => {
  console.error(`${context}:`, error);

  return res.status(500).json({
    success: false,
    message: error.message,
  });
};

const startConversation = async (req, res) => {
  try {
    const { title } = req.body || {};

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not found in token.",
      });
    }

    const conversation = await Conversation.create({
      user: req.user.id,
      title: title || "New Chat",
      messages: [],
    });

    return res.status(201).json({
      success: true,
      conversation,
    });
  } catch (error) {
    return handleServerError(res, error, "Start conversation failed");
  }
};

const getConversationHistory = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not found in token.",
      });
    }

    const conversations = await Conversation.find({
      user: req.user.id,
    }).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    return handleServerError(res, error, "Get conversation history failed");
  }
};

const sendMessage = async (req, res) => {
  try {
    const { conversationId, message, botId } = req.body || {};

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not found in token.",
      });
    }

    if (!conversationId || !message) {
      return res.status(400).json({
        success: false,
        message: "conversationId and message are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID",
      });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      user: req.user.id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const firstMessage = conversation.messages.length === 0;

    conversation.messages.push({
      content: message,
      isFromUser: true,
    });

    if (firstMessage && conversation.title === "New Chat") {
      conversation.title = buildConversationTitle(message);
    }

    const user = await User.findById(req.user.id);

    const parsedBotId = Number.isInteger(botId) ? botId : (botId ? Number(botId) : undefined);

    const botResponses = await orchestrator(
      user,
      conversation,
      message,
      parsedBotId
    );

    conversation.messages.push(...botResponses);

    await conversation.save();

    return res.status(200).json({
      success: true,
      messages: conversation.messages,
      conversation,
    });
  } catch (error) {
    return handleServerError(res, error, "Send message failed");
  }
};

const getConversationById = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not found in token.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID",
      });
    }

    const conversation = await Conversation.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.json({
      success: true,
      conversation,
    });
  } catch (error) {
    return handleServerError(res, error, "Get conversation by ID failed");
  }
};

const renameConversation = async (req, res) => {
  try {
    const { title } = req.body || {};

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not found in token.",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID",
      });
    }

    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title: title.trim() },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.json({
      success: true,
      conversation,
    });
  } catch (error) {
    return handleServerError(res, error, "Rename conversation failed");
  }
};

const deleteConversation = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not found in token.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID",
      });
    }

    const conversation = await Conversation.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.json({
      success: true,
      message: "Conversation deleted",
    });
  } catch (error) {
    return handleServerError(res, error, "Delete conversation failed");
  }
};

const chat = async (req, res) => {
  try {
    const { message } = req.body || {};

    const reply = await agentRouter(message);

    return res.json({
      success: true,
      reply,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  chat,
  startConversation,
  getConversationHistory,
  sendMessage,
  getConversationById,
  renameConversation,
  deleteConversation,
};
