import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { usePage } from '@inertiajs/react';
import {
    ChevronDown,
    Contact,
    LayoutDashboard,
    MenuIcon,
    User,
    Users,
} from 'lucide-react';
import { useRef } from 'react';
import NavLink from './NavLink';

export default function Sidebar() {
    const { auth } = usePage().props;
    const user = auth.user;

    const sidebarRef = useRef();

    const toggleSidebar = () => {
        const el = sidebarRef.current;
        if (!el) return;
        el.classList.toggle('hidden');
        el.classList.toggle('bg-white');
        el.classList.toggle('py-3');
        el.classList.toggle('px-6');
    };

    return (
        <nav className="relative z-10 flex flex-wrap items-center justify-between bg-white p-4 shadow-xl md:fixed md:bottom-0 md:right-0 md:top-0 md:block md:w-64 md:flex-row md:flex-nowrap md:overflow-hidden md:overflow-y-auto print:hidden">
            <div className="mx-auto flex w-full flex-wrap items-center justify-between px-0 md:min-h-full md:flex-col md:flex-nowrap md:items-stretch">
                {/* Mobile toggle button */}
                <button
                    className="cursor-pointer rounded border border-transparent bg-transparent px-3 py-1 text-xl leading-none text-black opacity-50 md:hidden"
                    type="button"
                    onClick={toggleSidebar}
                >
                    <MenuIcon className="h-6 w-6" />
                </button>

                {/* Company name */}
                <a
                    className="text-blueGray-800 inline-block px-5 text-lg font-bold md:block md:pb-2"
                    href={route('dashboard')}
                >
                    گروه چراغ برق
                </a>

                {/* Mobile user dropdown */}
                <div className="flex list-none flex-wrap items-center md:hidden">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <span className="inline-flex rounded-md">
                                <button
                                    type="button"
                                    className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    <User className="h-5 w-5" />
                                    <ChevronDown className="ml-1 h-4 w-4" />
                                </button>
                            </span>
                        </Dropdown.Trigger>
                        <Dropdown.Content>
                            <div className="bg-blueGray-700 flex w-full items-center justify-between whitespace-nowrap p-4 font-normal text-white">
                                <p className="text-xs">حساب کاربری:</p>
                                <p className="text-xs">{user.name}</p>
                            </div>
                            <ResponsiveNavLink
                                active={route().current('profile.edit')}
                                href={route('profile.edit')}
                                className="text-blueGray-700 block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal"
                            >
                                پروفایل کاربری
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                active={route().current('logout')}
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="w-full px-4 py-2 text-left text-sm font-normal outline-none focus:outline-none"
                            >
                                خروج
                            </ResponsiveNavLink>
                        </Dropdown.Content>
                    </Dropdown>
                </div>

                {/* Sidebar links */}
                <aside
                    className="absolute left-0 right-0 top-0 z-40 hidden h-auto flex-1 flex-col items-stretch overflow-y-auto overflow-x-hidden shadow md:relative md:mt-4 md:flex md:opacity-100 md:shadow-none print:hidden"
                    id="sidebar"
                    ref={sidebarRef}
                >
                    <ul className="flex list-none flex-col md:min-w-full md:flex-col">
                        {/* Dashboard */}
                        <li>
                            <NavLink
                                href={route('dashboard')}
                                active={route().current('dashboard')}
                            >
                                <div className="flex items-end gap-2">
                                    <LayoutDashboard className="h-5 w-5" />
                                    <span>داشبورد</span>
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                href={route('users.index')}
                                active={route().current('users.*')}
                            >
                                <div className="flex items-end gap-2">
                                    <Users className="h-5 w-5" />
                                    <span>مدیریت کاربران</span>
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                href={route('contacts.index')}
                                active={route().current('contacts.*')}
                            >
                                <div className="flex items-end gap-2">
                                    <Contact className="h-5 w-5" />
                                    <span>مخاطبین گروه</span>
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                href={route('products.index')}
                                active={route().current('products.index')}
                            >
                                <div className="flex items-end gap-2">
                                    <LayoutDashboard className="h-5 w-5" />
                                    <span>لیست کد های فنی</span>
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                href={route('messages.create')}
                                active={route().current('messages.create')}
                            >
                                <div className="flex items-end gap-2">
                                    <LayoutDashboard className="h-5 w-5" />
                                    <span>متن پیام ربات</span>
                                </div>
                            </NavLink>
                        </li>
                    </ul>
                </aside>
            </div>
        </nav>
    );
}
