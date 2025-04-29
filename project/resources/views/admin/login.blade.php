<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login Page</title>
    <link rel="icon" href="{{ asset('images/admin/dandeslogo-round.png') }}" type="image/jpg">
    <link href="{{ asset('css/admin/login.css') }}" rel="stylesheet">
</head>
<body>
@if(session('admin_logged_in'))
    <script>window.location.href = "{{ url('admin/dashboard') }}";</script>
@endif

<div class="container">
    <div class="login-box">
        <form action="{{ url('admin/login') }}" method="POST">
            @csrf
            <div class="page-box">
                <div class="login-title">
                    <h2 class="loginTitle-text">Login</h2>
                    <p class="user-email">Please login to use the admin panel</p>
                </div>

                <div class="page email-page">
                <div class="input-box">
                        <input type="text" name="username" class="email" required oninput="clearError()" id="username">
                        <label>Enter Username</label>
                        @if(session('error'))
                            <p id="error-message" style="color: red;">{{ session('error') }}</p>
                        @endif
                    </div>
                    <div class="forgot">
                        <label><input type="checkbox" class="remember-me" id="rememberMe"> Remember Me</label>
                    </div>

                    <div class="space"></div>
                    <div class="btn-box">
                        <h3>Dandes Resto</h3>
                        <button type="button" class="btn-next">Next</button>
                    </div>
                </div>

                <div class="page password-page">
                    <div class="input-box">
                        <input type="password" name="password" class="password" required>
                        <label>Enter Password</label>
                    </div>
                    <div class="forgot show">
                    <a href="{{ url('admin/forgot') }}">Forgot Password?</a>
                        <label><input type="checkbox" class="checkbox-pass"> Show password</label>
                    </div>
                    <div class="space"></div>
                    <div class="btn-box">
                        <button type="button" class="btn-back">Back</button>
                        <button type="submit" class="btn-next">Login</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>
<script src="{{ asset('js/admin/login.js') }}"></script>
</body>
</html>
