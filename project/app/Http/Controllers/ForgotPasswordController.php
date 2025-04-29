<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use App\Mail\ForgotPasswordMail;
use App\Models\AdminLogin; // Change model to match your table

class ForgotPasswordController extends Controller
{
    public function sendVerificationCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:adminlogin,email'
        ]);

        $code = rand(100000, 999999); // Generate 6-digit code
        Cache::put('password_reset_' . $request->email, $code, now()->addMinutes(10)); // Store in cache

        Mail::to($request->email)->send(new ForgotPasswordMail($code));

        return response()->json(['message' => 'Verification code sent to your email.']);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:adminlogin,email',
            'code' => 'required',
            'newPassword' => 'required|min:6|confirmed'
        ]);

        $storedCode = Cache::get('password_reset_' . $request->email);

        if (!$storedCode || $storedCode != $request->code) {
            return response()->json(['message' => 'Invalid or expired verification code.'], 800);
        }

        $user = AdminLogin::where('email', $request->email)->first();
        $user->password = $request->newPassword; // No encryption (Not Recommended)
        $user->save();

        Cache::forget('password_reset_' . $request->email);

        return response()->json(['message' => 'Password reset successfully.', 'success' => true]);
    }
}
