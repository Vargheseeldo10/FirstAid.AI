import React, { useState, useEffect, useRef } from "react";
import { useFirebase } from "../context/FirebaseContext";
import { useAuth } from "../context/AuthContext";
import { Send, AlertTriangle } from "lucide-react";
import { analyzeMessage } from "../utils/firstAidAI";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null); // Added error state
  
  const { sendMessage, subscribeToMessages } = useFirebase();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    console.log("👀 Subscribing to messages...");
    const unsubscribe = subscribeToMessages((newMessages) => {
      setMessages(newMessages);
    });

    return () => {
      console.log("👋 Unsubscribing from messages...");
      if (unsubscribe) unsubscribe();
    };
  }, [user, subscribeToMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    setError(null); // Clear any previous errors
    setIsTyping(true);

    try {
      // Step 1: Send user message
      await sendMessage({
        text: message.trim(),
        type: "user",
      });

      // Step 2: Generate and send AI response
      const aiResponse = analyzeMessage(message.trim());
      
      // Clear input right after sending
      setMessage("");

      // Add slight delay for natural feel
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Send AI response
      await sendMessage({
        text: aiResponse,
        type: "ai",
      });

    } catch (err) {
      console.error("Error in chat:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Login</h2>
          <p className="text-gray-600">
            You need to be logged in to use the chat.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-red-500 text-white">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <AlertTriangle />
            FirstAid.AI Emergency Assistant
          </h2>
          <p className="text-sm mt-1 opacity-90">
            For life-threatening emergencies, always call emergency services
            first!
          </p>
        </div>

        <div className="h-[60vh] overflow-y-auto p-4 space-y-4 bg-gray-50">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  msg.type === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white shadow-md text-gray-800"
                }`}
              >
                <div className="text-sm opacity-75 mb-1">
                  {msg.type === "user" ? "You" : "FirstAid.AI"}
                </div>
                <div className="whitespace-pre-line">{msg.text}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white shadow-md rounded-lg p-4 max-w-[80%]">
                <div className="text-sm opacity-75 mb-1">FirstAid.AI</div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the emergency or ask for first aid advice..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={isTyping || !message.trim()}
              className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}