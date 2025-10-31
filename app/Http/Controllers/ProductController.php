<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\SimilarProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use PhpOffice\PhpSpreadsheet\IOFactory;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::with('simillars')->orderBy('id', 'desc');

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%$search%")
                    ->orWhere('brand', 'like', "%$search%")
                    ->orWhere('description', 'like', "%$search%");
            });
        }

        $products = $query->paginate(20)->withQueryString();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters' => $request->only('search'),
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv',
        ]);

        $path = $request->file('file')->getRealPath();
        $spreadsheet = IOFactory::load($path);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray();

        foreach (array_slice($rows, 1) as $row) {
            $productCode = $this->sanitizeInput($row[1]) ?? null; // کد فنی
            $similarCodes = $row[2] ?? null;   // مشابه ها
            $brand = $row[3] ?? null;
            $price = $row[4] ?? 0;
            $description = $row[5] ?? null;
            $with_price = $row[6] ?? null;
            $without_price = $row[7] ?? null;
            $is_bot_allowed = $row[8] ?? null;


            if (strlen($productCode)) {
                $product = Product::create(
                    [
                        'user_id' => Auth::id(),
                        'code' => $productCode,
                        'price' => $price,
                        'brand' => $brand,
                        'description' => $description,
                        'with_price' => $with_price,
                        'without_price' => $without_price,
                        'is_bot_allowed' => $is_bot_allowed,
                    ]
                );

                // حذف مشابه های قبلی
                SimilarProduct::where('product_id', $product->id)->delete();

                // ذخیره مشابه ها
                if ($similarCodes) {
                    $similarCodes = $this->extractSimilarCodes($similarCodes);
                    foreach ($similarCodes as $simCode) {
                        $simCode = trim($simCode);
                        if ($simCode) {
                            SimilarProduct::create([
                                'product_id' => $product->id,
                                'similar_code' => $simCode,
                            ]);
                        }
                    }
                }
            }
        }

        return back()->with('success', 'محصولات با موفقیت وارد شدند.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }


    // ----------------------- Helpers Function
    private function  sanitizeInput($data)
    {
        if (empty($data)) {
            return;
        }
        // Trim, strip slashes, escape HTML
        $data = htmlspecialchars(stripslashes(trim($data)));

        // Remove all non-alphanumeric characters (letters and numbers only)
        $data = preg_replace("/[^a-zA-Z0-9]/", "", $data);

        // Convert to uppercase
        return strtoupper($data);
    }

    private function extractSimilarCodes($similar_codes)
    {
        if (empty($similar_codes)) {
            return [];
        }

        $codes = explode('/', $similar_codes);
        $result = [];

        foreach ($codes as $code) {
            $cleaned = $this->sanitizeInput($code);
            if (!empty($cleaned)) {
                $result[] = $cleaned;
            }
        }

        return $result;
    }
}
