import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Edit, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast, Toaster } from 'sonner';

export default function ProductIndex() {
    const { products, filters } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [editing, setEditing] = useState({
        id: null,
        field: null,
        value: '',
    });

    const { delete: destroy, processing, reset, errors } = useForm();

    // 🔍 Search
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('products.index'),
            { search },
            { preserveState: true },
        );
    };

    // 🗑️ Delete confirm
    const confirmDeleting = (id) => {
        setConfirmDelete(true);
        setSelectedProduct(id);
    };
    const cancelDeleting = () => {
        setConfirmDelete(false);
        setSelectedProduct(null);
    };
    const deleteProduct = (e) => {
        e.preventDefault();
        destroy(route('products.destroy', selectedProduct), {
            preserveScroll: true,
            onSuccess: () => {
                cancelDeleting();
                toast.success('محصول حذف شد', {
                    description: 'کدفنی با موفقیت حذف شد.',
                    position: 'bottom-left',
                    style: {
                        backgroundColor: 'seagreen',
                        fontFamily: 'Vazir',
                        color: 'white',
                        fontWeight: 'bold',
                    },
                });
            },
        });
    };

    // ✅ Update a field
    const handleChange = async (productId, field, value) => {
        try {
            await axios.post(route('field.update', productId), {
                field,
                value,
            });
            router.reload({ only: ['products'], preserveScroll: true });
            toast.success('ذخیره شد ✅', {
                description: 'اطلاعات با موفقیت ذخیره شد.',
                position: 'bottom-left',
                style: {
                    backgroundColor: 'seagreen',
                    fontFamily: 'Vazir',
                    color: 'white',
                },
            });
        } catch {
            toast.error('خطا در بروزرسانی', {
                position: 'bottom-left',
                style: {
                    backgroundColor: 'red',
                    fontFamily: 'Vazir',
                    color: 'white',
                },
            });
        }
    };

    // ✏️ Double-click editing
    const handleDoubleClick = (id, field, value) => {
        setEditing({ id, field, value });
    };
    const handleEditChange = (e) => {
        setEditing((prev) => ({ ...prev, value: e.target.value }));
    };
    const handleBlur = () => {
        if (editing.id && editing.field) {
            handleChange(editing.id, editing.field, editing.value);
        }
        setEditing({ id: null, field: null, value: '' });
    };

    return (
        <AuthenticatedLayout title="لیست کد های فنی">
            <Head title="لیست کد های فنی" />
            <Toaster richColors />

            <div className="container mx-auto p-4">
                <h1 className="mb-4 text-2xl font-bold">لیست محصولات</h1>

                {/* 🔍 Search box */}
                <form onSubmit={handleSearch} className="mb-4 flex gap-2">
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

                {/* 🧾 Product Table */}
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

                                        {/* مشابه‌ها */}
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

                                        {/* ✅ برند */}
                                        <td
                                            className="cursor-pointer px-4 py-2"
                                            onDoubleClick={() =>
                                                handleDoubleClick(
                                                    product.id,
                                                    'brand',
                                                    product.brand || '',
                                                )
                                            }
                                        >
                                            {editing.id === product.id &&
                                            editing.field === 'brand' ? (
                                                <input
                                                    type="text"
                                                    value={editing.value}
                                                    onChange={handleEditChange}
                                                    onBlur={handleBlur}
                                                    autoFocus
                                                    className="w-full rounded border px-2 py-1 text-sm"
                                                />
                                            ) : (
                                                product.brand || '-'
                                            )}
                                        </td>

                                        {/* ✅ قیمت */}
                                        <td
                                            className="cursor-pointer px-4 py-2 text-center"
                                            onDoubleClick={() =>
                                                handleDoubleClick(
                                                    product.id,
                                                    'price',
                                                    product.price || '',
                                                )
                                            }
                                        >
                                            {editing.id === product.id &&
                                            editing.field === 'price' ? (
                                                <input
                                                    type="number"
                                                    value={editing.value}
                                                    onChange={handleEditChange}
                                                    onBlur={handleBlur}
                                                    autoFocus
                                                    className="w-full rounded border px-2 py-1 text-center text-sm"
                                                />
                                            ) : (
                                                product.price || '-'
                                            )}
                                        </td>

                                        {/* ✅ توضیحات */}
                                        <td
                                            className="cursor-pointer px-4 py-2"
                                            onDoubleClick={() =>
                                                handleDoubleClick(
                                                    product.id,
                                                    'description',
                                                    product.description || '',
                                                )
                                            }
                                        >
                                            {editing.id === product.id &&
                                            editing.field === 'description' ? (
                                                <input
                                                    type="text"
                                                    value={editing.value}
                                                    onChange={handleEditChange}
                                                    onBlur={handleBlur}
                                                    autoFocus
                                                    className="w-full rounded border px-2 py-1 text-sm"
                                                />
                                            ) : (
                                                product.description || '-'
                                            )}
                                        </td>

                                        {/* ✅ Checkboxes */}
                                        <td className="px-4 py-2 text-center">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    !!product.without_price
                                                }
                                                onChange={(e) =>
                                                    handleChange(
                                                        product.id,
                                                        'without_price',
                                                        e.target.checked
                                                            ? 1
                                                            : 0,
                                                    )
                                                }
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    !!product.is_bot_allowed
                                                }
                                                onChange={(e) =>
                                                    handleChange(
                                                        product.id,
                                                        'is_bot_allowed',
                                                        e.target.checked
                                                            ? 1
                                                            : 0,
                                                    )
                                                }
                                            />
                                        </td>

                                        {/* ✏️ Actions */}
                                        <td className="px-4 py-2 text-center">
                                            <div className="flex justify-center gap-2">
                                                <Edit
                                                    onClick={() =>
                                                        toast.info(
                                                            'در حال توسعه...',
                                                        )
                                                    }
                                                    className="h-5 w-5 cursor-pointer text-sky-700"
                                                />
                                                <Trash
                                                    onClick={() =>
                                                        confirmDeleting(
                                                            product.id,
                                                        )
                                                    }
                                                    className="h-5 w-5 cursor-pointer text-rose-700"
                                                />
                                            </div>
                                        </td>
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

                {/* 🔄 Pagination */}
                <div className="mt-4 flex justify-center space-x-2">
                    {products.links.map((link, i) => (
                        <button
                            key={i}
                            className={`rounded border px-3 py-1 ${
                                link.active
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white'
                            }`}
                            disabled={!link.url}
                            onClick={() => link.url && router.get(link.url)}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>

            {/* ❌ Delete Confirmation */}
            <Modal show={confirmDelete} onClose={cancelDeleting}>
                <form onSubmit={deleteProduct} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        آیا مطمئن هستید که می‌خواهید این محصول را حذف کنید؟
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        بعد از حذف، اطلاعات دیگر در دسترس نخواهد بود.
                    </p>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={cancelDeleting}>
                            انصراف
                        </SecondaryButton>
                        <DangerButton className="ms-3" disabled={processing}>
                            حذف
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
