import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-gray-800">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6 text-center"
            >
                <h1 className="text-8xl font-extrabold text-gray-900">404</h1>
                <p className="mt-4 text-2xl font-semibold">Page Not Found</p>
                <p className="mt-2 text-gray-500">
                    Sorry, the page you’re looking for doesn’t exist or has been
                    moved.
                </p>

                <Link
                    href="/"
                    className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-white shadow transition-all duration-200 hover:bg-blue-700"
                >
                    <Home size={20} />
                    Back to Home
                </Link>
            </motion.div>
        </div>
    );
}
