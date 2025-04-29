<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password</title>
    <link rel="icon" href="{{ asset('images/admin/dandeslogo.jpg') }}" type="image/jpg">
    <link href="{{ asset('css/admin/forgot.css') }}" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!-- Font Awesome for eye icon -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        .verification-box {
            display: flex;
            align-items: center;
            position: relative;
        }

        .verification-box input {
            flex: 1;
            padding-right: 50px;
        }

        .verification-box button, 
        .verification-box #timer {
            position: absolute;
            right: 10px;
            background: #72c8ff;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }

        .verification-box #timer {
            display: none;
            font-size: 16px;
            color: red;
            background: transparent;
            font-weight: bold;
        }

        .show-hide-toggle {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            color: white;
            font-size: 16px;
        }

        .input-box.password-box {
            position: relative;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="login-box">
        <h2 class="loginTitle-text">Forgot Password</h2>
        <p>Enter your email to receive a verification code.</p>

        <div class="input-box">
            <input type="email" id="email" required>
            <label>Enter Email</label>
        </div>

        <div class="input-box verification-box">
            <input type="text" id="verificationCode" maxlength="6" required placeholder="Enter Verification Code">
            <button id="sendCode" onclick="sendVerificationCode()">Send</button>
            <span id="timer"></span>
        </div>

        <div class="input-box password-box">
            <input type="password" id="newPassword" required>
            <label>New Password</label>
            <i class="fas fa-eye show-hide-toggle" onclick="togglePassword('newPassword', this)"></i>
        </div>

        <div class="input-box password-box">
            <input type="password" id="confirmPassword" required>
            <label>Confirm Password</label>
            <i class="fas fa-eye show-hide-toggle" onclick="togglePassword('confirmPassword', this)"></i>
        </div>

        <button class="reset-btn" onclick="resetPassword()">Reset Password</button>
    </div>
</div>

<script>
    function sendVerificationCode() {
        let email = $("#email").val();
        if (!email) {
            alert("Please enter your email.");
            return;
        }

        $("#sendCode").hide();  
        $("#timer").show().text("30");

        $.post("{{ url('/send-verification-code') }}", {
            _token: "{{ csrf_token() }}",
            email: email
        }, function(response) {
            alert(response.message);
            $("#verificationCode").val(response.code);

            let timeLeft = 30;
            let timer = setInterval(function () {
                timeLeft--;
                $("#timer").text(timeLeft);

                if (timeLeft <= 0) {
                    clearInterval(timer);
                    $("#timer").hide();  
                    $("#sendCode").show().text("Send");  
                }
            }, 1000);
        }).fail(function(xhr) {
            alert(xhr.responseJSON.message);
            $("#sendCode").show().text("Send");
            $("#timer").hide();
        });
    }

    function resetPassword() {
        $.post("{{ url('/reset-password') }}", {
            _token: "{{ csrf_token() }}",
            email: $("#email").val(),
            code: $("#verificationCode").val(),
            newPassword: $("#newPassword").val(),
            newPassword_confirmation: $("#confirmPassword").val()
        }, function(response) {
            alert(response.message);
            if (response.success) {
                window.location.href = "{{ url('admin/login') }}";
            }
        }).fail(function(xhr) {
            alert(xhr.responseJSON.message);
        });
    }

    function togglePassword(fieldId, icon) {
        const input = document.getElementById(fieldId);
        const isHidden = input.type === "password";
        input.type = isHidden ? "text" : "password";
        icon.classList.toggle("fa-eye");
        icon.classList.toggle("fa-eye-slash");
    }
</script>

</body>
</html>
