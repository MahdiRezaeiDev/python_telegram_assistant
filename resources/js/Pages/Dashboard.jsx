import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function TelegramDashboard() {
    return (
        <AuthenticatedLayout title="داشبورد">
            <Head title="داشبورد" />
        </AuthenticatedLayout>
    );
}
