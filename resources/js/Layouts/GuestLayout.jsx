import login_bg from '@/img/login_bg.png';
export default function GuestLayout({ children }) {
    return (
        <div
            className="bg-blueGray-800 bg-full h-screen bg-no-repeat font-sans"
            style={{
                backgroundImage: `url(${login_bg})`,
            }}
        >
            <main className="relative w-full pt-32">
                <div className="h- container mx-auto px-4">
                    <div className="h- flex content-center items-center justify-center">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
