export function Button({ children, className = '', ...props }) {
    return (
        <button
            {...props}
            className={`rounded-lg bg-teal-600 px-4 py-2 font-semibold text-white transition hover:bg-teal-700 ${className}`}
        >
            {children}
        </button>
    );
}

export function SecondaryButton({ children, className = '', ...props }) {
    return (
        <button
            {...props}
            className={`rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-800 transition hover:bg-gray-300 ${className}`}
        >
            {children}
        </button>
    );
}

export function DangerButton({ children, className = '', ...props }) {
    return (
        <button
            {...props}
            className={`rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700 ${className}`}
        >
            {children}
        </button>
    );
}
