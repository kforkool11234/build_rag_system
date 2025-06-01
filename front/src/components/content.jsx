// components/Content.jsx
"use client"; // Marks this as a Client Component in Next.js

import { useState, useEffect, useRef } from 'react'; // Import useEffect and useRef
import { usecollection } from "@/context"; // Assuming this context provides the `coll` (collection name)
import Upload from "./upload"; // Assuming your Upload component exists
import ChatComponent from "./chat"; // Your ChatComponent
import axios from 'axios'; // Import axios

// Configuration for your API
const API_BASE_URL = 'http://localhost:8000/'; // Your Django API base URL
const API_ENDPOINT = 'chat/'; // Your communications list/create endpoint

function Content() {
  const { coll } = usecollection(); // Get the selected collection name from context
  const [messages, setMessages] = useState([]); // State to hold chat messages
  const [newMessage, setNewMessage] = useState(''); // State for the input field
  const [isSending, setIsSending] = useState(false); // State for send button loading

  // --- Get User ID (Example: from localStorage or an Auth Context) ---
  // In a real app, you'd get this from your user authentication system (e.g., NextAuth.js session)
  const [userId, setUserId] = useState(null);

  // --- Function to Send Message ---
  const sendMessage = async () => {
    if (!newMessage.trim() || isSending || !coll ) {
        // Prevent sending if empty, already sending, no collection selected, or user ID is unknown
        return;
    }

    const myToken = localStorage.getItem('token'); // Get token from localStorage
    if (!myToken) {
        alert('Authentication token not found. Please log in.');
        return;
    }

    setIsSending(true);
    try {
        const payload = {
            c_name: coll, // Use `coll` from context as `chatCname`
            sender: 'User', // The human user is the sender
            message: newMessage.trim(),
            // `user` (recipient) is handled by the Django serializer's `CurrentUserDefault()`
        };

        const response = await axios.post(`${API_BASE_URL}${API_ENDPOINT}`, payload, {
            headers: {
                'Authorization': `Bearer ${myToken}`, // Token-based authentication
                'Content-Type': 'application/json',
            },
            // `withCredentials: true` is typically not needed for pure Token-based auth
            // unless your backend specifically relies on session cookies alongside tokens.
            // If you get CSRF errors with this setup, re-add it and ensure Django's
            // CSRF middleware is configured to ignore token-authenticated requests.
        });

        // Optimistically update UI with user's sent message
        setMessages((prevMessages) => [...prevMessages, response.data]);
        setNewMessage(''); // Clear input field

        // --- Simulate Bot Response ---
        // In a real app, this would be a separate API call to your bot logic,
        // which might then save its own response to the database.
        // For now, we simulate saving the bot's message as well.
        setTimeout(async () => {
          console.log(response.data.message)
            const botMessageText = await axios.post("http://127.0.0.1:8000/search/",{
              "query":response.data.message,
              "c_name":coll,
              "api":"AIzaSyBZMnOUbjbBBXuEvagDWOU8VEG_XZ6FaTc",
              "role":"teacher"
            },{
              headers: {
                'Authorization': `Bearer ${myToken}`, // Token-based authentication
                'Content-Type': 'application/json',
            }
            });
            const botPayload = {
                c_name: coll,
                sender: 'Bot', // This is the bot's message
                message: botMessageText.data.result,
                // 'user' (recipient) is still handled by serializer as the authenticated user
            };

            const botResponse = await axios.post(`${API_BASE_URL}${API_ENDPOINT}`, botPayload, {
                headers: {
                    'Authorization': `Bearer ${myToken}`,
                    'Content-Type': 'application/json',
                },
            });

            // Add the bot's response to the UI
            setMessages((prevMessages) => [...prevMessages, botResponse.data]);
            setIsSending(false); // Enable send button after bot replies
        }, 1500); // Simulate bot typing delay

    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
        alert('Failed to send message. Please try again.');
        setIsSending(false); // Enable send button on error
    }
  };

  return (
    <div
      className="flex-1 flex h-full gap-4 p-6 overflow-hidden"
      style={{ backgroundColor: "#0c151d" }}
    >
      {coll ? (
        // --- If a collection is selected (coll is truthy) ---
        <>
          {/* Left side: Chat area + Input */}
          <div className="flex flex-col flex-1">
            <div className="text-white text-3xl font-bold px-4 py-2 rounded mb-4" style={{ color: "#66C3FF" }}>
              {coll} {/* Display the actual collection name */}
            </div>
            {/* Chat messages area */}
            <div className="flex-1 bg-darker p-4 rounded mb-6 overflow-y-auto"> {/* Added overflow-y-auto */}
              {/* Pass messages, setMessages, userId, and chatCname (coll) to ChatComponent */}
              <ChatComponent
                messages={messages}
                setMessages={setMessages}
                userId={userId} // Pass the dynamically obtained userId
                chatCname={coll} // Pass the selected collection name
              />
            </div>

            {/* Input area */}
            <div className="flex items-center bg-black p-4 rounded mx-auto w-10/12 h-1/10 text-2xl">
              <input
                type="text"
                id="message-input"
                className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none" // Tailwind classes for input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={isSending}
              />
              <button
                onClick={sendMessage}
                disabled={isSending}
                cursor="pointer"
                className="ml-3 text-accent text-2xl" // Tailwind classes for button
              >
                {isSending ? '...' : <>&#10148;</>}
              </button>
            </div>
          </div>

          {/* Right side: Upload box */}
          <div className=" w-3/12 flex items-center justify-center">
            <Upload/>
          </div>
        </>
      ) : (
        // --- If no collection is selected (coll is falsy) ---
        <div className="flex-1 flex items-center justify-center text-center text-gray-500 text-4xl">
          <p>Please Select a Collection to Begin</p>
        </div>
      )}
    </div>
  );
}

export default Content;