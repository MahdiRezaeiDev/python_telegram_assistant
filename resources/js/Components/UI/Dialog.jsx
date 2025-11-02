import { useState } from 'react';

export function Dialog({ children }) {
    return <>{children}</>;
}

export function DialogTrigger({ asChild, children }) {
    return children;
}

export function DialogContent({ children }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                {children}
            </div>
        </div>
    );
}

export function DialogHeader({ children }) {
    return <div className="mb-2">{children}</div>;
}

export function DialogTitle({ children }) {
    return <h2 className="text-lg font-semibold">{children}</h2>;
}
