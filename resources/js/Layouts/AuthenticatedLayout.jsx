import Nav from '@/Components/Nav';
import Sidebar from '@/Components/Sidebar';

export default function AuthenticatedLayout({ title, children }) {
    return (
        <div className="min-h-screen">
            <Sidebar />
            <main className="relative md:mr-64">
                <Nav title={title} />
                <div className="md:py-16">{children}</div>
            </main>
        </div>
    );
}
