<?php

namespace App\Models\OPD;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class opd extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'opd';
}
