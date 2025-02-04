import { createContext, useContext } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getDatabase,
  ref,
  push,
  onValue,
  query,
  orderByChild,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAsKLxAzdt_Wf3CyoUCE4izrSdNh50SLto",
  authDomain: "firstaid-ai-4a1fd.firebaseapp.com",
  projectId: "firstaid-ai-4a1fd",
  storageBucket: "firstaid-ai-4a1fd.firebasestorage.app",
  messagingSenderId: "407902398252",
  appId: "1:407902398252:web:a51757f1b013738eb2ae89",
  measurementId: "G-G8DVPBMB94"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const database = getDatabase(app);

const FirebaseContext = createContext(null);

export function FirebaseProvider({ children }) {
  const sendMessage = async ({ text, type }) => {
    try {
      console.log("🔥 Sending message:", { text, type });
      const chatRef = ref(database, "chats");
      
      // Wait for the push to complete
      const newRef = await push(chatRef, {
        text,
        type,
        timestamp: Date.now(),
      });

      console.log("✅ Message sent successfully!", newRef.key);
      return newRef.key;
    } catch (error) {
      console.error("❌ Error sending message:", error);
      throw error;
    }
  };

  const subscribeToMessages = (callback) => {
    const chatRef = ref(database, "chats");
    const messagesQuery = query(chatRef, orderByChild("timestamp"));
    return onValue(messagesQuery, (snapshot) => {
      const msgs = [];
      snapshot.forEach((childSnapshot) => {
        msgs.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      console.log("📥 Received messages from Firebase:", msgs);
      callback(msgs);
    });
  };

  return (
    <FirebaseContext.Provider value={{ sendMessage, subscribeToMessages }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
}