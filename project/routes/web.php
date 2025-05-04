<?php
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\AdminDash;
use App\Http\Controllers\ForgotPasswordController;

Route::post('/send-verification-code', [ForgotPasswordController::class, 'sendVerificationCode']);
Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword']);

Route::get('admin/login', function () {
return view('admin.login');
})->name('admin.login');

Route::post('admin/login', function (Request $request) {
$username = trim($request->input('username'));
$password = trim($request->input('password'));
// Check if the user exists
$user = DB::table('adminlogin')->where('username', $username)->first();

if ($user && $password === $user->password) { 
    session(['admin_logged_in' => true]); // Store session
    return redirect('admin/dashboard'); // Redirect on success
} else {
    return back()->with('error', 'Invalid username or password.');
}
});

Route::get('admin/dashboard', function () {
if (!session('admin_logged_in')) {
return redirect('admin/login')->with('error', 'Please log in first.');
}
return view('admin.dashboard');
});
Route::get('admin/event', function () {
if (!session('admin_logged_in')) {
return redirect('admin/login')->with('error', 'Please log in first.');
}
return view('admin.event');
});
Route::get('admin/venue', function () {
    if (!session('admin_logged_in')) {
    return redirect('admin/login')->with('error', 'Please log in first.');
    }
    return view('admin.venue');
    });
    Route::get('admin/promo', function () {
        if (!session('admin_logged_in')) {
        return redirect('admin/login')->with('error', 'Please log in first.');
        }
        return view('admin.promo');
        });
Route::post('admin/logout', function () {
session()->forget('admin_logged_in'); // Clear session
return redirect('admin/login')->with('success', 'Logged out successfully.');
});
Route::get('admin/logout', function () {
session()->forget('admin_logged_in'); // Clear session
return redirect('admin/login')->with('success', 'Logged out successfully.');
});
Route::get('admin/forgot', function () {
return view('admin.forgot');
});

Route::post('admin/reset-password', function (Request $request) {
$email = $request->input('email');
$newPassword = Hash::make($request->input('newPassword'));
$user = DB::table('adminlogin')->where('email', $email)->first();

if (!$user) {
    return response()->json(['success' => false, 'message' => 'Email not found!']);
}

DB::table('adminlogin')
    ->where('email', $email)
    ->update(['password' => $newPassword]);

return response()->json(['success' => true, 'message' => 'Password updated successfully!']);
});

Route::post('/admin/menu/delete-category', [AdminDash::class, 'deleteCategory'])->name('admin.menu.deleteCategory');
Route::post('/admin/menu', [AdminDash::class, 'saveCategory'])->name('admin.saveCategory');
Route::get('/admin/menu', [AdminDash::class, 'allM'])->name('admin.menu') ;
Route::get('/admin/event', [AdminDash::class, 'allE'])->name('admin.event') ;
Route::get('/admin/venue', [AdminDash::class, 'allV'])->name('admin.venue') ;
Route::get('/admin/dashboard', [AdminDash::class, 'allD'])->name('admin.event') ;
Route::get('/admin/categories/dropdown', [App\Http\Controllers\AdminDash::class, 'dropdown']);
Route::get('/admin/category/{name}', [App\Http\Controllers\AdminDash::class, 'getCategory']);
Route::post('/admin/category/update', [AdminDash::class, 'updateCategory'])->name('category.update');
Route::post('/admin/menu/save', [AdminDash::class, 'saveMenu'])->name('admin.saveMenu');
Route::post('/delete-menu-items', [AdminDash::class, 'deleteMenuItems']);
Route::post('/admin/menu/update', [AdminDash::class, 'update'])->name('admin.updateMenu');
Route::post('/admin/menu/update', [AdminDash::class, 'updateMenu'])->name('admin.menu.update');
Route::post('/admin/event/save', [AdminDash::class, 'store'])->name('admin.event.save');
Route::post('/admin/event/delete', [AdminDash::class, 'deleteEvents'])->name('admin.event.delete');
Route::put('/admin/event/update', [AdminDash::class, 'update'])->name('admin.event.update');
Route::post('/venue/store', [AdminDash::class, 'storeV'])->name('venue.store');
Route::post('/admin/venue/delete', [AdminDash::class, 'deleteV'])->name('admin.venue.delete');
Route::post('/admin/venue/delete-multiple', [AdminDash::class, 'deleteMultipleV'])->name('admin.venue.deleteMultiple');
Route::post('/admin/venue/edit', [AdminDash::class, 'editV'])->name('admin.venue.edit');
Route::get('admin/promo', [AdminDash::class, 'GA']);
Route::post('/admin/promo/store', [AdminDash::class, 'storePromo'])->name('admin.promo.store');
Route::post('/admin/promo/delete', [AdminDash::class, 'deletePromos'])->name('admin.promo.delete');
Route::post('/admin/promo/update', [AdminDash::class, 'updatePromo'])->name('admin.promo.update');