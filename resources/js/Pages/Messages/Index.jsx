import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea'; // ✅ correct import path (lowercase)
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { LucideUndo2, Save, Trash2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function DefaultReply({ defaultReply }) {
    const form = useForm({
        id: defaultReply?.id ?? '',
        content: defaultReply?.message ?? '',
    });

    function submit(e) {
        e.preventDefault();
        form.post(route('messages.store'), {
            preserveState: true,
            onSuccess: () => {
                toast.success('اطلاعات موفقانه ذخیره شد!', {
                    description: 'پیام پیش‌فرض شما موفقانه ذخیره گردید.',
                    position: 'bottom-left',
                    duration: 3000,
                    style: {
                        backgroundColor: 'seagreen',
                        fontFamily: 'Vazir',
                        color: 'white',
                        fontWeight: 'bold',
                    },
                });
            },
            onError: () => {
                toast.error('خطا در ذخیره پیام پیش‌فرض', {
                    position: 'bottom-left',
                    duration: 3000,
                });
            },
        });
    }

    function remove() {
        if (!form.data.id) {
            toast.error('هیچ پیام فعالی برای حذف وجود ندارد.');
            return;
        }

        if (!confirm('آیا از حذف پیام پیش‌فرض مطمئن هستید؟')) return;

        form.delete(route('messages.destroy', form.data.id), {
            preserveState: true,
            onSuccess: (res) => {
                console.log(res);

                form.setData({ id: '', content: '' });
                toast.success('عملیات موفقانه انجام شد!', {
                    description: 'پیام پیش فرض شما موفقانه حذف گردید',
                    position: 'bottom-left',
                    duration: 3000,
                    style: {
                        backgroundColor: 'seagreen',
                        fontFamily: 'Vazir',
                        color: 'white',
                        fontWeight: 'bold',
                    },
                });
            },
            onError: () => {
                toast.success('عملیات ناموفق  !', {
                    description:
                        'پیام پیش فرش شما حذف نگردید، لطفا بعدا تلاش نمایید.',
                    position: 'bottom-left',
                    duration: 3000,
                    style: {
                        backgroundColor: 'red',
                        fontFamily: 'Vazir',
                        color: 'white',
                        fontWeight: 'bold',
                    },
                });
            },
        });
    }

    return (
        <AuthenticatedLayout title="تنظیم پیام پیش‌فرض">
            <Head title="پیام پیش‌فرض" />
            <Toaster richColors />
            <main className="p-6">
                <div className="mx-auto max-w-3xl">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="mb-2">
                                        پیام پیش‌فرض پاسخ
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        یک پیام پیش‌فرض برای پاسخ‌دهی خودکار یا
                                        پیشنهاد به اپراتورها تنظیم کنید. تنها یک
                                        پیام قابل تنظیم است.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <form onSubmit={submit}>
                            <CardContent>
                                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                                    متن پیام
                                </label>

                                <Textarea
                                    value={form.data.content}
                                    onChange={(e) =>
                                        form.setData('content', e.target.value)
                                    }
                                    placeholder="اینجا متن پیش‌فرض را وارد کنید..."
                                    rows={6}
                                />

                                {form.errors.content && (
                                    <p className="mt-2 text-sm text-destructive">
                                        {form.errors.content}
                                    </p>
                                )}

                                {form.data.content ? (
                                    <div className="mt-4 rounded-md border bg-muted p-3 text-sm text-muted-foreground">
                                        <strong>پیش‌نمایش پیام فعلی:</strong>
                                        <div className="mt-2 whitespace-pre-wrap">
                                            {form.data.content}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-4 rounded-md border border-dashed p-3 text-sm text-muted-foreground">
                                        هنوز هیچ پیام پیش‌فرضی تنظیم نشده است.
                                    </div>
                                )}
                            </CardContent>

                            <CardFooter>
                                <div className="flex w-full items-center justify-between gap-2">
                                    <div className="flex gap-2">
                                        <Button
                                            type="submit"
                                            disabled={form.processing}
                                        >
                                            <Save className="ml-1 h-4 w-4" />
                                            ذخیره
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            type="button"
                                            onClick={() =>
                                                form.setData({
                                                    id: defaultReply?.id ?? '',
                                                    content:
                                                        defaultReply?.message ??
                                                        '',
                                                })
                                            }
                                        >
                                            <LucideUndo2 className="ml-1 h-4 w-4" />
                                            بازنشانی
                                        </Button>
                                    </div>

                                    <Button
                                        variant="destructive"
                                        type="button"
                                        onClick={remove}
                                        disabled={
                                            !form.data.id || form.processing
                                        }
                                    >
                                        <Trash2 className="ml-2 h-4 w-4" />
                                        حذف پیام
                                    </Button>
                                </div>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </main>
        </AuthenticatedLayout>
    );
}
