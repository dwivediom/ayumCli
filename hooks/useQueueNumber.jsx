// hooks/useQueueNumber.js

import { useSocket } from '../context/SocketContext';
import { useEffect, useState } from 'react';

export function useQueueNumber() {
  const { currentNumber, isConnected, error } = useSocket();
  
  return {
    currentNumber,
    isConnected,
    error
  };
}