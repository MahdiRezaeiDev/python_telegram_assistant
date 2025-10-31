import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { Edit, Trash } from 'lucide-react';
import { useState } from 'react';

export default function ProductIndex() {
    const { products, filters } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [editing, setEditing] = useState(null); // product id being edited
    const [editData, setEditData] = useState({});

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('products.index'), { search });
    };

    const handleEdit = (product) => {
        setEditing(product.id);
        setEditData({
            brand: product.brand || '',
            price: product.price || '',
            description: product.description || '',
            without_price: product.without_price || '',
            is_bot_allowed: product.is_bot_allowed ? 1 : 0,
        });
    };

    const handleCancel = () => {
        setEditing(null);
        setEditData({});
    };

    const handleSave = (id) => {
        router.patch(route('products.update', id), editData, {
            preserveScroll: true,
            onSuccess: () => {
                setEditing(null);
                setEditData({});
            },
        });
    };

    const handleChange = (field, value) => {
        setEditData((prev) => ({ ...prev, [field]: value }));
    };

    const handleDelete = () => {};

    return (
        <AuthenticatedLayout title="لیست کد های فنی">
            <Head title="لیست کد های فنی" />

            <div className="container mx-auto p-4">
                <h1 className="mb-4 text-2xl font-bold">لیست محصولات</h1>

                {/* Search */}
                <form onSubmit={handleSearch} className="mb-4 flex space-x-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="جستجو..."
                        className="flex-grow rounded border p-2"
                    />
                    <button
                        type="submit"
                        className="rounded bg-blue-500 px-4 py-2 text-white"
                    >
                        جستجو
                    </button>
                </form>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 text-sm">
                        <thead className="bg-teal-700 text-white">
                            <tr>
                                <th className="px-4 py-2">#</th>
                                <th className="px-4 py-2">کد فنی</th>
                                <th className="px-4 py-2">مشابه ها</th>
                                <th className="px-4 py-2">برند</th>
                                <th className="px-4 py-2">قیمت</th>
                                <th className="px-4 py-2">توضیحات</th>
                                <th className="px-4 py-2">ارسال بدون قیمت</th>
                                <th className="px-4 py-2">اجازه ربات</th>
                                <th className="px-4 py-2">اقدامات</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.data.length > 0 ? (
                                products.data.map((product, index) => (
                                    <tr
                                        key={product.id}
                                        className="even:bg-gray-100"
                                    >
                                        <td className="px-4 py-2">
                                            {products.from + index}
                                        </td>
                                        <td className="px-4 py-2">
                                            {product.code}
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="grid grid-cols-2 gap-1 text-xs">
                                                {product.simillars.map(
                                                    (sim) => (
                                                        <span
                                                            key={sim.id}
                                                            className="inline rounded bg-gray-200 px-2 py-1"
                                                        >
                                                            {sim.similar_code}
                                                        </span>
                                                    ),
                                                )}
                                            </div>
                                        </td>

                                        {/* Editable cells */}
                                        {editing === product.id ? (
                                            <>
                                                <td className="px-2 py-1">
                                                    <input
                                                        type="text"
                                                        value={editData.brand}
                                                        onChange={(e) =>
                                                            handleChange(
                                                                'brand',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded border p-1 text-xs"
                                                    />
                                                </td>
                                                <td className="px-2 py-1">
                                                    <input
                                                        type="number"
                                                        value={editData.price}
                                                        onChange={(e) =>
                                                            handleChange(
                                                                'price',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded border p-1 text-xs"
                                                    />
                                                </td>
                                                <td className="px-2 py-1">
                                                    <input
                                                        type="text"
                                                        value={
                                                            editData.description
                                                        }
                                                        onChange={(e) =>
                                                            handleChange(
                                                                'description',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded border p-1 text-xs"
                                                    />
                                                </td>
                                                <td className="px-2 py-1">
                                                    <input
                                                        type="number"
                                                        value={
                                                            editData.without_price
                                                        }
                                                        onChange={(e) =>
                                                            handleChange(
                                                                'without_price',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded border p-1 text-xs"
                                                    />
                                                </td>
                                                <td className="px-2 py-1 text-center">
                                                    <select
                                                        value={
                                                            editData.is_bot_allowed
                                                        }
                                                        onChange={(e) =>
                                                            handleChange(
                                                                'is_bot_allowed',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="rounded border p-1"
                                                    >
                                                        <option value="1">
                                                            بله
                                                        </option>
                                                        <option value="0">
                                                            خیر
                                                        </option>
                                                    </select>
                                                </td>
                                                <td className="px-2 py-1 text-center">
                                                    <button
                                                        onClick={() =>
                                                            handleSave(
                                                                product.id,
                                                            )
                                                        }
                                                        className="mx-1 rounded bg-green-500 px-2 py-1 text-white"
                                                    >
                                                        ذخیره
                                                    </button>
                                                    <button
                                                        onClick={handleCancel}
                                                        className="rounded bg-gray-400 px-2 py-1 text-white"
                                                    >
                                                        لغو
                                                    </button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-4 py-2">
                                                    {product.brand}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {product.price}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {product.description}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {product.without_price}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {product.is_bot_allowed
                                                        ? 'بله'
                                                        : 'خیر'}
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <div className="flex items-center gap-2">
                                                        <Edit
                                                            onClick={() =>
                                                                handleEdit(
                                                                    product,
                                                                )
                                                            }
                                                            className="h-5 w-5 text-sky-700"
                                                        />
                                                        <Trash
                                                            onClick={() => {
                                                                handleDelete(
                                                                    product.id,
                                                                );
                                                            }}
                                                            className="h-5 w-5 text-rose-700"
                                                        />
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="9"
                                        className="px-4 py-2 text-center"
                                    >
                                        هیچ محصولی یافت نشد
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex justify-center space-x-2">
                    {products.links.map((link, i) => (
                        <button
                            key={i}
                            className={`rounded border px-3 py-1 ${link.active ? 'bg-blue-500 text-white' : 'bg-white'}`}
                            disabled={!link.url}
                            onClick={() => link.url && router.get(link.url)}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
