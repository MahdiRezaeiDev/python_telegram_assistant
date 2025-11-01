import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'block px-2 py-3 text-sm font-bold uppercase hover:bg-cyan-700 ' +
                (active
                    ? ' bg-cyan-700 text-white'
                    : 'text-blueGray-800 hover:text-white') +
                className
            }
        >
            {children}
        </Link>
    );
}
