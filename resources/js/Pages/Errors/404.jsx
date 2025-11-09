import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-gray-800">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="p-6 text-center"
            >
                <h1 className="text-8xl font-extrabold text-gray-900">۴۰۴</h1>
                <p className="mt-4 text-2xl font-semibold">
                    صفحه مورد نظر یافت نشد
                </p>
                <p className="mt-2 text-gray-500">
                    متأسفانه صفحه‌ای که به دنبال آن بودید وجود ندارد یا حذف شده
                    است.
                </p>

                <Link
                    href="/"
                    className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-white shadow transition-all duration-200 hover:bg-blue-700"
                >
                    <Home size={20} />
                    بازگشت به صفحه اصلی
                </Link>
            </motion.div>
        </div>
    );
}
