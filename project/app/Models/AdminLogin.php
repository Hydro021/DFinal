<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class AdminLogin extends Authenticatable
{
    use HasFactory;

    protected $table = 'adminlogin'; // Define table name

    protected $fillable = ['email', 'password']; // Adjust based on your table columns
}
