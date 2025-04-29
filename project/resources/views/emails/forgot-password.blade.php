<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            text-align: center;
            padding: 20px;
        }
        .email-container {
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            margin: auto;
        }
        h1 {
            color: #007BFF;
        }
        .code {
            font-size: 24px;
            font-weight: bold;
            background: #f8f9fa;
            padding: 10px;
            border-radius: 5px;
            display: inline-block;
            margin: 10px 0;
        }
        .footer {
            font-size: 12px;
            color: #777;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h1>Password Reset Request</h1>
        <p>Hello,</p>
        <p>Your password reset verification code is:</p>
        <div class="code">{{ $code }}</div>
        <p>Use this code to reset your password. The code expires in 10 minutes.</p>
        <p>Thank you!</p>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Dandes Restaurant Team. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
