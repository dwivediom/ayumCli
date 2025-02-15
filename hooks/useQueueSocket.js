// hooks/useQueueSocket.js
"use client";

import { useState, useEffect } from "react";
import io from "socket.io-client";

export function useQueueSocket(doctorId, patientId) {
  const [socket, setSocket] = useState(null);
  const [currentNumber, setCurrentNumber] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!doctorId) return;

    const socketInstance = io("https://crn.ayum.in", {
      query: { doctorId, patientId },
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      setError(null);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (err) => {
      setError("Connection failed");
      setIsConnected(false);
    });

    socketInstance.on("numberUpdate", ({ currentNumber }) => {
      setCurrentNumber(currentNumber);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [doctorId, patientId]);

  return { currentNumber, isConnected, error };
}
