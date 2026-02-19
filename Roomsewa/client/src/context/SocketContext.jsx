import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const socket = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (user) {
      // Socket connect गर्ने
      socket.current = io('http://localhost:5000', {
        withCredentials: true,
      });

      // User online add गर्ने
      socket.current.emit('addUser', user._id);

      // Online users list update गर्ने
      socket.current.on('getUsers', (users) => {
        setOnlineUsers(users);
      });

      console.log('🔌 Socket connected');
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        console.log('❌ Socket disconnected');
      }
    };
  }, [user]);

  const isUserOnline = (userId) => {
    return onlineUsers.some((u) => u.userId === userId);
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socket.current,
        onlineUsers,
        isUserOnline,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};