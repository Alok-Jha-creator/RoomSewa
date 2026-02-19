import Message from '../models/message.model.js';
import { errorHandler } from '../utils/error.js';

// ─── GET CONVERSATION ID ───
const getConversationId = (userId1, userId2, propertyId) => {
  const sortedIds = [userId1, userId2].sort();
  return `${sortedIds[0]}_${sortedIds[1]}_${propertyId}`;
};

// ─── SEND MESSAGE ───
export const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, propertyId, text } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !propertyId || !text) {
      return next(errorHandler(400, 'All fields are required'));
    }

    const conversationId = getConversationId(senderId, receiverId, propertyId);

    const message = new Message({
      conversationId,
      sender: senderId,
      receiver: receiverId,
      property: propertyId,
      text,
    });

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .populate('property', 'title');

    res.status(201).json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET MESSAGES ───
export const getMessages = async (req, res, next) => {
  try {
    const { receiverId, propertyId } = req.params;
    const senderId = req.user.id;

    const conversationId = getConversationId(senderId, receiverId, propertyId);

    const messages = await Message.find({ conversationId })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      {
        conversationId,
        receiver: senderId,
        isRead: false,
      },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET ALL CONVERSATIONS ───
export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get all messages where user is sender or receiver
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .populate('property', 'title photos')
      .sort({ createdAt: -1 });

    // Group by conversationId (get latest message of each conversation)
    const conversationsMap = {};
    messages.forEach((msg) => {
      if (!conversationsMap[msg.conversationId]) {
        conversationsMap[msg.conversationId] = msg;
      }
    });

    const conversations = Object.values(conversationsMap);

    // Count unread messages
    const unreadCount = await Message.countDocuments({
      receiver: userId,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      conversations,
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE MESSAGE ───
export const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(id);

    if (!message) {
      return next(errorHandler(404, 'Message not found'));
    }

    if (message.sender.toString() !== userId) {
      return next(errorHandler(403, 'You can only delete your own messages'));
    }

    await Message.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};