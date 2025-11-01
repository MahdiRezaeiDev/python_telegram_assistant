import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/UI/Textarea'; // فرض بر وجود کامپوننت شاد‌سی‌ان
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Save, Trash2 } from 'lucide-react';

export default function DefaultReply({ defaultReply }) {
    const form = useForm({
        content: defaultReply ?? '',
    });

    function submit(e) {
        e.preventDefault();
        form.post(route('settings.default-reply.store'), {
            preserveState: true,
            onSuccess: () => {
                // پیام موفقیت با flash در سرور کنسل یا از sweetalert استفاده کنید
            },
        });
    }

    function remove() {
        if (!confirm('آیا از حذف پیام پیش‌فرض مطمئن هستید؟')) return;

        form.delete(route('settings.default-reply.destroy'), {
            preserveState: true,
            onSuccess: () => {
                form.setData('content', '');
            },
        });
    }

    return (
        <AuthenticatedLayout title="تنظیم پیام پیش‌فرض">
            <Head title="پیام پیش‌فرض" />
            <main className="p-6">
                <div className="mx-auto max-w-3xl">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>پیام پیش‌فرض پاسخ</CardTitle>
                                    <CardDescription>
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

                                <p className="mt-2 text-xs text-muted-foreground">
                                    می‌توانید از متغیرها نیز استفاده کنید (در
                                    صورت نیاز، در سرور پردازش‌شان کنید).
                                </p>

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
                                    <div>
                                        <Button
                                            type="submit"
                                            disabled={form.processing}
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            ذخیره
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            className="ml-2"
                                            onClick={() => {
                                                form.setData(
                                                    'content',
                                                    defaultReply ?? '',
                                                );
                                            }}
                                        >
                                            بازنشانی
                                        </Button>
                                    </div>

                                    <div>
                                        <Button
                                            variant="destructive"
                                            onClick={remove}
                                            disabled={
                                                !form.data.content ||
                                                form.processing
                                            }
                                        >
                                            <Trash2 className="ml-2 h-4 w-4" />
                                            حذف پیام
                                        </Button>
                                    </div>
                                </div>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </main>
        </AuthenticatedLayout>
    );
}
