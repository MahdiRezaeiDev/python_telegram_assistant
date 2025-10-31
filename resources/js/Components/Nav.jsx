import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { usePage } from '@inertiajs/react';
import { User } from 'lucide-react';
export default function Nav({ title }) {
    const user = usePage().props.auth.user;
    return (
        <nav className="absolute right-0 top-0 z-10 hidden w-full items-center bg-teal-700 p-4 md:flex md:flex-row md:flex-nowrap md:justify-end print:hidden">
            <div className="mx-autp flex w-full flex-wrap items-center justify-between px-4 md:flex-nowrap md:px-10">
                <p className="text-sm font-semibold uppercase text-white md:inline-block">
                    {title}
                </p>

                <div className="flex list-none flex-wrap items-center">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <span className="inline-flex rounded-md">
                                <button
                                    type="button"
                                    className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                >
                                    <User className="h-5 w-5" />

                                    <svg
                                        className="-me-0.5 ms-2 h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </span>
                        </Dropdown.Trigger>
                        <Dropdown.Content>
                            <div className="flex w-full items-center justify-between whitespace-nowrap bg-teal-700 p-4 font-normal text-white">
                                <p className="text-xs font-semibold">
                                    حساب کاربری:
                                </p>
                                <p className="text-xs font-semibold">
                                    {user.name}
                                </p>
                            </div>
                            <ResponsiveNavLink
                                href={route('profile.edit')}
                                active={route().current('profile.edit')}
                                className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-teal-700"
                            >
                                پروفایل کاربری
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                href={route('myAccount')}
                                active={route().current('myAccount')}
                                className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-teal-700"
                            >
                                حساب تلگرام
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-right text-sm font-normal text-teal-700"
                            >
                                خروج
                            </ResponsiveNavLink>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </div>
        </nav>
    );
}
