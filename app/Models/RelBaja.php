<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RelBaja extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'rel_trabajador_baja';
}
