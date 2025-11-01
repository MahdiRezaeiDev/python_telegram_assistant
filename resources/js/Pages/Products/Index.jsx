import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
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
                reset();
            },
            onError: () => {
                console.log(errors);
            },
        });
    };

    // ✅ Instant, safe update
    const handleChange = async (productId, field, value) => {
        // 1️⃣ Immediately reflect change in UI
        const prevProducts = [...products.data];
        const index = prevProducts.findIndex((p) => p.id === productId);
        if (index !== -1) prevProducts[index][field] = value;

        // Optional: disable input while saving
        setEditing({ id: productId, field: 'saving', value });

        try {
            // 2️⃣ Send update to backend
            await axios.post(route('field.update', productId), {
                field,
                value,
            });

            // 3️⃣ Mark as done
            toast.success('ذخیره شد ✅', {
                description: 'تغییرات با موفقیت ذخیره شد.',
                position: 'bottom-left',
                style: {
                    backgroundColor: 'seagreen',
                    fontFamily: 'Vazir',
                    color: 'white',
                },
            });
        } catch {
            // 4️⃣ Revert change on failure
            toast.error('خطا در بروزرسانی', {
                position: 'bottom-left',
                style: {
                    backgroundColor: 'red',
                    fontFamily: 'Vazir',
                    color: 'white',
                },
            });
            if (index !== -1) prevProducts[index][field] = !value;
        } finally {
            setEditing({ id: null, field: null, value: '' });
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

            <div className="container mx-auto rounded-2xl bg-white p-6 shadow">
                <h1 className="mb-6 border-b pb-2 text-2xl font-bold text-gray-800">
                    لیست محصولات
                </h1>

                {/* 🔍 Top toolbar */}
                <div className="mb-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
                    <form
                        onSubmit={handleSearch}
                        className="flex w-full flex-grow gap-2 sm:w-auto"
                    >
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="جستجو بر اساس کد یا برند..."
                            className="flex-grow rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        />
                        <button
                            type="submit"
                            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
                        >
                            جستجو
                        </button>
                    </form>

                    <div className="flex flex-wrap items-center gap-2">
                        <Link
                            href={route('products.create')}
                            className="rounded-lg bg-amber-600 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                        >
                            دانلود نمونه فایل
                        </Link>
                        <Link
                            href={route('products.create')}
                            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            آپلود کدهای فنی
                        </Link>
                        <DangerButton className="rounded-lg bg-rose-600 px-3 py-2 text-sm text-white hover:bg-rose-700">
                            حذف همه کدها
                        </DangerButton>
                    </div>
                </div>

                {/* 🧾 Product Table */}
                <div className="overflow-x-auto rounded-lg border shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-teal-700 uppercase text-white">
                            <tr>
                                <th className="px-4 py-3 text-center">#</th>
                                <th className="px-4 py-3 text-right">کد فنی</th>
                                <th className="px-4 py-3 text-right">
                                    مشابه‌ها
                                </th>
                                <th className="px-4 py-3 text-right">برند</th>
                                <th className="px-4 py-3 text-right">قیمت</th>
                                <th className="px-4 py-3 text-right">
                                    توضیحات
                                </th>
                                <th className="px-4 py-3 text-center">
                                    ارسال بدون قیمت
                                </th>
                                <th className="px-4 py-3 text-center">
                                    اجازه ربات
                                </th>
                                <th className="px-4 py-3 text-center">
                                    اقدامات
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {products.data.length > 0 ? (
                                products.data.map((product, index) => (
                                    <tr
                                        key={product.id}
                                        className={`transition hover:bg-gray-50 ${
                                            editing.id === product.id
                                                ? 'bg-yellow-50'
                                                : 'bg-white'
                                        }`}
                                    >
                                        <td className="px-4 py-2 text-center text-gray-600">
                                            {products.from + index}
                                        </td>
                                        <td className="px-4 py-2 text-right font-mono text-gray-800">
                                            {product.code}
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            <div className="flex flex-wrap gap-1">
                                                {product.simillars.map(
                                                    (sim) => (
                                                        <span
                                                            key={sim.id}
                                                            className="inline rounded-md bg-gray-200 px-2 py-1 text-xs"
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
                                                disabled={
                                                    editing.id === product.id
                                                } // disable while saving
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
                                                disabled={
                                                    editing.id === product.id
                                                } // disable while saving
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
                                                            'در حال توسعه',
                                                            {
                                                                description:
                                                                    'امکان ویرایش تمامی مشخصات در حال حاضر در دسترس نیست',
                                                                position:
                                                                    'bottom-left',
                                                                style: {
                                                                    backgroundColor:
                                                                        'dodgerblue',
                                                                    fontFamily:
                                                                        'Vazir',
                                                                    color: 'white',
                                                                    fontWeight:
                                                                        'bold',
                                                                },
                                                            },
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
                                        className="px-4 py-6 text-center text-gray-500"
                                    >
                                        هیچ محصولی یافت نشد 🙁
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 🔄 Pagination */}
                {products.links.length > 3 && (
                    <div className="mt-5 flex flex-wrap justify-center gap-1 text-sm">
                        {products.links.map((link, idx) => {
                            let label = link.label;
                            if (label.includes('Next')) label = 'بعدی';
                            else if (label.includes('Previous')) label = 'قبلی';

                            return (
                                <button
                                    key={idx}
                                    onClick={() =>
                                        link.url && router.get(link.url)
                                    }
                                    className={`rounded-md border px-3 py-1 ${
                                        link.active
                                            ? 'bg-teal-700 text-white'
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: label }}
                                />
                            );
                        })}
                    </div>
                )}
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
                    <div className="mt-6 flex justify-start">
                        <DangerButton className="me-3" disabled={processing}>
                            حذف
                        </DangerButton>
                        <SecondaryButton onClick={cancelDeleting}>
                            انصراف
                        </SecondaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
