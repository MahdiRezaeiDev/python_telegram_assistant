import Wallpaper from '@/img/wallpaper.jpg';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { Loader2, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function TelegramChat() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: '123456789',
            sender_name: 'Mahdi',
            message: 'Hello everyone!',
            is_outgoing: false,
            created_at: '2025-11-05T16:20:00',
        },
        {
            id: 2,
            sender: 'me',
            message: 'Hi!',
            is_outgoing: true,
            created_at: '2025-11-05T16:21:00',
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const chatEndRef = useRef(null);

    const fetchMessages = async () => {
        try {
            const res = await axios.get('/api/messages');
            setMessages(res.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        await axios.post('/api/messages', { message: input });
        setInput('');
        fetchMessages();
    };

    return (
        <AuthenticatedLayout title="پیلم های گروه">
            <Head title="پیلم های گروه" />
            <div className="mx-auto flex h-screen max-w-2xl flex-col bg-gray-100">
                {/* Header */}
                <div className="flex items-center justify-between border-b bg-white/90 p-3 shadow backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <img
                            src="/telegram-icon.png"
                            alt="Telegram"
                            className="h-8 w-8 rounded-full"
                        />
                        <h2 className="font-semibold text-gray-800">
                            گروه تلگرام
                        </h2>
                    </div>
                </div>

                {/* Chat messages */}
                <div
                    className="flex-1 space-y-3 overflow-y-auto p-4"
                    style={{
                        backgroundColor: '#e3f2fd',
                        backgroundImage: `url(${Wallpaper})`,
                        backgroundRepeat: 'repeat',
                        backgroundSize: 'auto',
                    }}
                >
                    {isLoading ? (
                        <div className="flex h-full items-center justify-center text-gray-500">
                            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                            در حال بارگذاری پیام‌ها...
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex h-full items-center justify-center text-gray-400">
                            پیامی وجود ندارد
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${
                                    msg.is_outgoing
                                        ? 'justify-end'
                                        : 'justify-start'
                                }`}
                            >
                                <div
                                    className={`max-w-xs rounded-2xl px-4 py-2 shadow md:max-w-md ${
                                        msg.is_outgoing
                                            ? 'rounded-br-none bg-blue-500/90 text-white'
                                            : 'rounded-bl-none bg-white/80 text-gray-800'
                                    } backdrop-blur-sm`}
                                >
                                    {!msg.is_outgoing && (
                                        <p className="text-sm font-semibold text-gray-600">
                                            {msg.sender_name || msg.sender}
                                        </p>
                                    )}
                                    <p className="whitespace-pre-wrap">
                                        {msg.message}
                                    </p>
                                    <p className="mt-1 text-right text-xs text-gray-500">
                                        {new Date(
                                            msg.created_at,
                                        ).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={chatEndRef}></div>
                </div>

                {/* Input area */}
                <div className="flex items-center gap-2 border-t bg-white/90 p-3 backdrop-blur-sm">
                    <input
                        type="text"
                        placeholder="ارسال پیام به گروه...."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        className="flex-1 rounded-full border border-gray-300 bg-white/70 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={sendMessage}
                        className="rounded-full bg-blue-500 p-2 text-white transition hover:bg-blue-600"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
