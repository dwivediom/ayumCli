// context/SocketContext.js
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export function SocketProvider({ children, doctorId, patientId }) {
  const [socket, setSocket] = useState(null);
  const [currentNumber, setCurrentNumber] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!doctorId) return;

    const socketInstance = io('http://localhost:9000', {
      query: { doctorId, patientId }
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      setError(null);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (err) => {
      setError('Connection failed');
      setIsConnected(false);
    });

    socketInstance.on('numberUpdate', ({ currentNumber }) => {
      setCurrentNumber(currentNumber);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [doctorId, patientId]);

  return (
    <SocketContext.Provider value={{ socket, currentNumber, isConnected, error }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);