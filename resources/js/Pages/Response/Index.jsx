import telegram from '@/img/telegram.svg';
import Wallpaper from '@/img/wallpaper.jpg';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { Loader2, Send, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function TelegramChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const chatEndRef = useRef(null);

    // Fetch messages from backend
    const fetchMessages = async () => {
        try {
            const res = await axios.post(route('response.get'));
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
        <AuthenticatedLayout title="پیام‌های گروه">
            <Head title="پیام‌های گروه" />
            <div className="mx-auto flex h-screen max-w-2xl flex-col bg-gray-100">
                {/* Header */}
                <div className="flex items-center justify-between border-b bg-white/90 p-3 shadow backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <img
                            src={telegram}
                            alt="Telegram"
                            className="h-8 w-8 rounded-full"
                        />
                        <h2 className="font-semibold text-gray-800">
                            گروه تلگرام
                        </h2>
                    </div>
                </div>

                {/* Chat area */}
                <div
                    className="relative flex-1 overflow-y-auto p-4"
                    style={{
                        backgroundImage: `url(${Wallpaper})`,
                        backgroundRepeat: 'repeat',
                        backgroundSize: 'auto',
                        backgroundColor: '#e3f2fd',
                    }}
                >
                    {/* Overlay for readability */}
                    <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]" />

                    {/* Messages */}
                    <div className="relative space-y-3">
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
                            messages.map((msg) => {
                                const isOutgoing =
                                    msg.outgoing && msg.outgoing.length > 0;

                                const senderName =
                                    msg.sender?.full_name ||
                                    msg.sender?.username ||
                                    'کاربر ناشناس';

                                const senderPhoto =
                                    msg.sender?.profile_photo_path || null;

                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex ${
                                            isOutgoing
                                                ? 'justify-end'
                                                : 'justify-start'
                                        }`}
                                    >
                                        {/* Avatar for incoming messages */}
                                        {!isOutgoing && (
                                            <div className="mr-2 mt-auto flex h-8 w-8 items-center justify-center">
                                                {senderPhoto ? (
                                                    <img
                                                        src={senderPhoto}
                                                        alt={senderName}
                                                        className="h-8 w-8 rounded-full border border-gray-300 object-cover"
                                                    />
                                                ) : (
                                                    <User className="h-6 w-6 text-gray-500" />
                                                )}
                                            </div>
                                        )}

                                        {/* Message bubble */}
                                        <div
                                            className={`max-w-xs rounded-2xl px-4 py-2 shadow-md transition md:max-w-md ${
                                                isOutgoing
                                                    ? 'rounded-br-none bg-blue-500 text-white shadow-blue-100'
                                                    : 'rounded-bl-none bg-white/90 text-gray-800 shadow-gray-200'
                                            }`}
                                        >
                                            {!isOutgoing && (
                                                <p className="text-sm font-semibold text-gray-600">
                                                    {senderName}
                                                </p>
                                            )}
                                            <p className="whitespace-pre-wrap">
                                                {isOutgoing
                                                    ? msg.outgoing[0]?.response
                                                    : msg.message}
                                            </p>
                                            <p className="mt-1 text-right text-xs text-gray-500">
                                                {msg.created_at
                                                    ? new Date(
                                                          msg.created_at,
                                                      ).toLocaleTimeString([], {
                                                          hour: '2-digit',
                                                          minute: '2-digit',
                                                      })
                                                    : ''}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={chatEndRef}></div>
                    </div>
                </div>

                {/* Input bar */}
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
