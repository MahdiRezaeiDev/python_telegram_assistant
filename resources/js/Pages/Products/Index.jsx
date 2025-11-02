import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Download, Edit, Search, Trash, Upload } from 'lucide-react';
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
    const { delete: destroy, processing, reset } = useForm();

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
                    description: 'کد فنی با موفقیت حذف گردید.',
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
            onError: () => toast.error('خطا در حذف محصول'),
        });
    };

    // ✅ Instant safe update
    const handleChange = async (productId, field, value) => {
        const prev = [...products.data];
        const idx = prev.findIndex((p) => p.id === productId);
        if (idx !== -1) prev[idx][field] = value;
        setEditing({ id: productId, field: 'saving', value });

        try {
            await axios.post(route('field.update', productId), {
                field,
                value,
            });
            toast.success('ذخیره شد ✅', {
                description: 'تغییرات با موفقیت ذخیره شد.',
                position: 'bottom-left',
                style: { backgroundColor: 'seagreen', color: 'white' },
            });
        } catch {
            toast.error('خطا در بروزرسانی', {
                position: 'bottom-left',
                style: { backgroundColor: 'red', color: 'white' },
            });
        } finally {
            setEditing({ id: null, field: null, value: '' });
        }
    };

    // ✏️ Double-click editing
    const handleDoubleClick = (id, field, value) => {
        setEditing({ id, field, value });
    };
    const handleEditChange = (e) =>
        setEditing((prev) => ({ ...prev, value: e.target.value }));
    const handleBlur = () => {
        if (editing.id && editing.field) {
            handleChange(editing.id, editing.field, editing.value);
        }
        setEditing({ id: null, field: null, value: '' });
    };

    return (
        <AuthenticatedLayout title="لیست کدهای فنی">
            <Head title="لیست کدهای فنی" />
            <Toaster richColors />

            <div className="container mx-auto p-6">
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                    <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <h1 className="text-2xl font-bold text-gray-800">
                            📦 لیست محصولات
                        </h1>

                        {/* 🔍 Search + Actions */}
                        <div className="flex flex-wrap items-center gap-2">
                            <form
                                onSubmit={handleSearch}
                                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-2 py-1 focus-within:ring-2 focus-within:ring-cyan-500"
                            >
                                <Search className="h-4 w-4 text-gray-500" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="جستجو بر اساس کد یا برند..."
                                    className="border-none bg-transparent px-2 py-1 text-sm outline-none focus:border-none focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="rounded-md bg-cyan-600 px-3 py-1 text-sm font-semibold text-white hover:bg-cyan-700"
                                >
                                    جستجو
                                </button>
                            </form>

                            <Link
                                href={route('products.downloadSample')}
                                className="flex items-center gap-1 rounded-md bg-amber-500 px-3 py-2 text-sm font-medium text-white hover:bg-amber-600"
                            >
                                <Download className="h-4 w-4" />
                                نمونه فایل
                            </Link>

                            <Link
                                href={route('products.create')}
                                className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                <Upload className="h-4 w-4" />
                                آپلود فایل
                            </Link>

                            <DangerButton className="rounded-md bg-rose-600 px-3 py-2 text-sm text-white hover:bg-rose-700">
                                حذف همه کدها
                            </DangerButton>
                        </div>
                    </div>

                    {/* 🧾 Table */}
                    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-cyan-700 text-white">
                                <tr>
                                    <th className="px-3 py-2 text-center">#</th>
                                    <th className="px-3 py-2 text-right">
                                        کد فنی
                                    </th>
                                    <th className="px-3 py-2 text-right">
                                        مشابه‌ها
                                    </th>
                                    <th className="px-3 py-2 text-right">
                                        برند
                                    </th>
                                    <th className="px-3 py-2 text-right">
                                        قیمت
                                    </th>
                                    <th className="px-3 py-2 text-right">
                                        توضیحات
                                    </th>
                                    <th className="px-3 py-2 text-center">
                                        بدون قیمت
                                    </th>
                                    <th className="px-3 py-2 text-center">
                                        اجازه ربات
                                    </th>
                                    <th className="px-3 py-2 text-center">
                                        اقدامات
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.data.length > 0 ? (
                                    products.data.map((product, i) => (
                                        <tr
                                            key={product.id}
                                            className={`transition hover:bg-gray-50 ${
                                                editing.id === product.id
                                                    ? 'bg-yellow-50'
                                                    : ''
                                            }`}
                                        >
                                            <td className="px-4 py-2 text-center text-gray-600">
                                                {products.from + i}
                                            </td>
                                            <td className="px-4 py-2 font-mono text-gray-800">
                                                {product.code}
                                            </td>
                                            <td className="px-4 py-2">
                                                <div className="flex flex-wrap gap-1">
                                                    {product.simillars.map(
                                                        (sim) => (
                                                            <span
                                                                key={sim.id}
                                                                className="rounded bg-gray-200 px-2 py-0.5 text-xs"
                                                            >
                                                                {
                                                                    sim.similar_code
                                                                }
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            </td>

                                            {/* Editable brand */}
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
                                                        onChange={
                                                            handleEditChange
                                                        }
                                                        onBlur={handleBlur}
                                                        autoFocus
                                                        className="w-full rounded border px-2 py-1 text-sm"
                                                    />
                                                ) : (
                                                    product.brand || '-'
                                                )}
                                            </td>

                                            {/* Editable price */}
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
                                                        onChange={
                                                            handleEditChange
                                                        }
                                                        onBlur={handleBlur}
                                                        autoFocus
                                                        className="w-full rounded border px-2 py-1 text-center text-sm"
                                                    />
                                                ) : (
                                                    product.price || '-'
                                                )}
                                            </td>

                                            {/* Editable description */}
                                            <td
                                                className="cursor-pointer px-4 py-2"
                                                onDoubleClick={() =>
                                                    handleDoubleClick(
                                                        product.id,
                                                        'description',
                                                        product.description ||
                                                            '',
                                                    )
                                                }
                                            >
                                                {editing.id === product.id &&
                                                editing.field ===
                                                    'description' ? (
                                                    <input
                                                        type="text"
                                                        value={editing.value}
                                                        onChange={
                                                            handleEditChange
                                                        }
                                                        onBlur={handleBlur}
                                                        autoFocus
                                                        className="w-full rounded border px-2 py-1 text-sm"
                                                    />
                                                ) : (
                                                    product.description || '-'
                                                )}
                                            </td>

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

                                            <td className="px-4 py-2 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <Edit
                                                        className="h-5 w-5 cursor-pointer text-sky-700 hover:text-sky-900"
                                                        onClick={() =>
                                                            toast.info(
                                                                'در حال توسعه...',
                                                            )
                                                        }
                                                    />
                                                    <Trash
                                                        className="h-5 w-5 cursor-pointer text-rose-600 hover:text-rose-800"
                                                        onClick={() =>
                                                            confirmDeleting(
                                                                product.id,
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="9"
                                            className="py-6 text-center text-gray-500"
                                        >
                                            هیچ محصولی یافت نشد 🙁
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {products.links.length > 3 && (
                        <div className="mt-5 flex flex-wrap justify-center gap-1 text-sm">
                            {products.links.map((link, i) => {
                                let label = link.label;
                                if (label.includes('Next')) label = 'بعدی';
                                else if (label.includes('Previous'))
                                    label = 'قبلی';
                                return (
                                    <button
                                        key={i}
                                        onClick={() =>
                                            link.url && router.get(link.url)
                                        }
                                        className={`rounded-md border px-3 py-1 ${
                                            link.active
                                                ? 'bg-cyan-700 text-white'
                                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                        } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                        dangerouslySetInnerHTML={{
                                            __html: label,
                                        }}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ❌ Delete Confirmation Modal */}
            <Modal show={confirmDelete} onClose={cancelDeleting}>
                <form onSubmit={deleteProduct} className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        آیا مطمئن هستید که می‌خواهید این محصول را حذف کنید؟
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        پس از حذف، این اطلاعات در دسترس نخواهد بود.
                    </p>
                    <div className="mt-6 flex justify-start gap-2">
                        <DangerButton disabled={processing}>حذف</DangerButton>
                        <SecondaryButton onClick={cancelDeleting}>
                            انصراف
                        </SecondaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
