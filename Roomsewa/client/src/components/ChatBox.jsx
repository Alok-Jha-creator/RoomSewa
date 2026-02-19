import { useState, useEffect, useRef, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';
import { AuthContext } from '../context/AuthContext';
import { sendMessage, getMessages } from '../api/Services';
import './ChatBox.css';

function ChatBox({ property, owner, onClose }) {
  const { user } = useContext(AuthContext);
  const { socket, isUserOnline } = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  // ─── Fetch existing messages ───
  useEffect(() => {
    fetchMessages();
  }, []);

  // ─── Listen for incoming messages ───
  useEffect(() => {
    if (socket) {
      socket.on('getMessage', (data) => {
        if (
          data.senderId === owner._id &&
          data.propertyId === property._id
        ) {
          setMessages((prev) => [
            ...prev,
            {
              sender: { _id: data.senderId },
              text: data.text,
              createdAt: data.createdAt,
            },
          ]);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('getMessage');
      }
    };
  }, [socket, owner._id, property._id]);

  // ─── Auto scroll to bottom ───
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await getMessages(owner._id, property._id);
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      setSending(true);

      // Save to database
      const data = await sendMessage({
        receiverId: owner._id,
        propertyId: property._id,
        text: newMessage,
      });

      // Add to local state
      setMessages((prev) => [...prev, data.message]);

      // Emit socket event
      if (socket) {
        socket.emit('sendMessage', {
          senderId: user._id,
          receiverId: owner._id,
          propertyId: property._id,
          text: newMessage,
        });
      }

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="chatbox-overlay">
      <div className="chatbox">
        
        {/* ── HEADER ── */}
        <div className="chatbox-header">
          <div className="chatbox-owner-info">
            <div className="chatbox-avatar">
              {owner.name?.charAt(0).toUpperCase()}
            </div>
            <div className="chatbox-owner-details">
              <h3>{owner.name}</h3>
              <span className={`online-status ${isUserOnline(owner._id) ? 'online' : 'offline'}`}>
                {isUserOnline(owner._id) ? '● Online' : '○ Offline'}
              </span>
            </div>
          </div>
          <div className="chatbox-property-title">
            🏠 {property.title}
          </div>
          <button className="chatbox-close" onClick={onClose}>✕</button>
        </div>

        {/* ── MESSAGES ── */}
        <div className="chatbox-messages" ref={scrollRef}>
          {loading ? (
            <div className="chat-loading">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="chat-empty">
              <p>💬 No messages yet</p>
              <p>Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${
                  msg.sender._id === user._id ? 'sent' : 'received'
                }`}
              >
                <div className="message-bubble">
                  <p className="message-text">{msg.text}</p>
                  <span className="message-time">
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── INPUT ── */}
        <form className="chatbox-input" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="send-btn"
          >
            {sending ? '⟳' : '➤'}
          </button>
        </form>

      </div>
    </div>
  );
}

export default ChatBox;