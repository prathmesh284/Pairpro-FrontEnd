//MonitoringContext.js

import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../socket"; // Adjust path to your socket setup

const MonitoringContext = createContext();

export function MonitoringProvider({ children, userId, roomId }) {
  const [showWarning, setShowWarning] = useState(false);
  const [maliciousDetected, setMaliciousDetected] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        const updatedCount = tabSwitchCount + 1;
        setTabSwitchCount(updatedCount);

        if (updatedCount === 3) {
          setMaliciousDetected(true);
          socket.emit("last-tab-warning", { userId, roomId }); // 🔔 Peer warning
          socket.emit("malicious-detected", { userId, roomId }); // 🟥 Full flag
        } else {
          setShowWarning(true);
          socket.emit("tab-warning", { userId, roomId }); // 🟡 Mild warning to peer
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [tabSwitchCount, userId, roomId]);

  useEffect(() => {
    if (showWarning) {
      const timer = setTimeout(() => setShowWarning(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showWarning]);

  return (
    <MonitoringContext.Provider value={{ showWarning, maliciousDetected }}>
      {children}
    </MonitoringContext.Provider>
  );
}

export const useMonitoring = () => useContext(MonitoringContext);
