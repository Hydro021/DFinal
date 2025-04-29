<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminLoginController extends Controller
{
    public function showLoginPage()
    {
        if (Auth::check()) {
            return redirect()->route('admin.dashboard');
        } elseif (Auth::check()) {
            return redirect()->route('admin.event');
        } elseif (Auth::check()) {
            return redirect()->route('admin.menu');
        }
        return view('admin.login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required'
        ]);

        $user = DB::table('adminlogin')->where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return back()->with('error', 'Invalid username or password.');
        }

        Auth::loginUsingId($user->id);
        return redirect()->route('admin.dashboard');
    }

    public function logout()
    {
        Auth::logout();
        return redirect()->route('admin.login')->with('success', 'Logged out successfully.');
    }
    public function index()
{
    // Fetch all categories from 'dandes.category'
    $categories = DB::table('dandes.category')->get();

    return view('admin.menu', compact('categories'));
}
}
