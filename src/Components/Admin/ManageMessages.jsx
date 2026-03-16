import React, { useState, useEffect } from 'react';
import { Trash2, Mail } from 'lucide-react';
import api from '../../api';

const ManageMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await api.get('/contact');
            setMessages(res.data);
        } catch (err) {
            console.error('Error fetching messages:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                await api.delete(`/contact/${id}`);
                setMessages(messages.filter((msg) => msg._id !== id));
            } catch (err) {
                console.error('Error deleting message:', err);
            }
        }
    };

    if (loading) return <div className="text-white p-4">Loading messages...</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Mail className="text-cyan-400" /> Messages ({messages.length})
            </h2>

            <div className="grid gap-4">
                {messages.length === 0 ? (
                    <p className="text-gray-400">No messages found.</p>
                ) : (
                    messages.map((msg) => (
                        <div key={msg._id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-cyan-400">{msg.name}</h3>
                                    <a href={`mailto:${msg.email}`} className="text-gray-400 hover:text-white text-sm">
                                        {msg.email}
                                    </a>
                                    <p className="text-gray-500 text-xs mt-1">
                                        {new Date(msg.date).toLocaleString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDelete(msg._id)}
                                    className="text-red-400 hover:text-red-300 p-2 hover:bg-gray-700 rounded-full transition-colors"
                                    title="Delete Message"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                            <div className="bg-gray-900/50 p-4 rounded text-gray-300 whitespace-pre-wrap">
                                {msg.message}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageMessages;
