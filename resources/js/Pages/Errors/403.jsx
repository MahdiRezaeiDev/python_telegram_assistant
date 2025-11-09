import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

export default function Forbidden() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-red-50 text-gray-800">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="p-6 text-center"
            >
                <ShieldAlert size={80} className="mx-auto text-red-500" />
                <h1 className="mt-4 text-6xl font-extrabold text-red-600">
                    ۴۰۳
                </h1>
                <p className="mt-2 text-2xl font-semibold">دسترسی غیرمجاز</p>
                <p className="mt-2 text-gray-500">
                    شما اجازه‌ی دسترسی به این صفحه را ندارید.
                </p>

                <Link
                    href="/"
                    className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-6 py-3 text-white shadow transition-all duration-200 hover:bg-red-700"
                >
                    بازگشت به خانه
                </Link>
            </motion.div>
        </div>
    );
}
