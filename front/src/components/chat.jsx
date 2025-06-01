// components/ChatComponent.jsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { usecollection } from '@/context';

const API_BASE_URL = 'http://localhost:8000/';
const API_ENDPOINT = 'chat/';

const ChatComponent = ({ messages, setMessages }) => {
    const { coll } = usecollection(); // Get the selected collection name from context

    // Removed userId state and its useEffect, as it's no longer needed on frontend
    // because backend derives user from token.

    const [isLoading, setIsLoading] = useState(true);
    const chatMessagesRef = useRef(null);

    const loadMessages = async () => {
        setIsLoading(true);
        console.log("ChatComponent: loadMessages called internally.");
        console.log("ChatComponent: Current coll (from context):", coll);

        try {
            // Adjusted guard check: Only 'coll' is needed now
            if (!coll) {
                console.warn("ChatComponent: Skipping message load. 'coll' is missing.");
                setIsLoading(false);
                return;
            }

            const myToken = localStorage.getItem('token');
            if (!myToken) {
                console.warn('ChatComponent: Authentication token not found for loading messages.');
                setIsLoading(false);
                return;
            }

            const response = await axios.get(`${API_BASE_URL}${API_ENDPOINT}`, {
                params: { // Use 'params' to send data as URL query parameters
                    c_name: coll,
                },
                headers: {
                    'Authorization': `Bearer ${myToken}`,
                },
            });

            console.log("ChatComponent: Messages API Response:", response);
            const sortedMessages = response.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            setMessages(sortedMessages);

        } catch (error) {
            console.error('ChatComponent: Error loading messages:', error.response ? error.response.data : error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Adjusted dependencies: Only 'coll' is needed now
        loadMessages();
    }, [coll]); // Dependencies are now just 'coll'

    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-2" ref={chatMessagesRef}>
                {isLoading ? (
                    <p className="text-gray-400">Loading messages...</p>
                ) : messages.length === 0 ? (
                    <p className="text-gray-400">No messages yet. Start the conversation!</p>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex mb-2 ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`message-bubble p-3 rounded-xl max-w-xs ${msg.sender === 'User' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'}`}
                            >
                                <p className="text-sm">{msg.message}</p>
                                <span className="text-xs text-gray-300 block mt-1 text-right">
                                    {msg.sender} - {new Date(msg.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ChatComponent;