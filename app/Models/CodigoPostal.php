<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CodigoPostal extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'catalogo_cp';
    protected $primaryKey = 'cp';
    public $incrementing = false;
}
