import { io } from "socket.io-client";

const socket = io("https://pairpro-backend-v0qk.onrender.com", {
  transports: ["websocket"],
  autoConnect: true, // Auto connect once globally
  reconnectionAttempts: 5,
  timeout: 10000,
});

export { socket };
