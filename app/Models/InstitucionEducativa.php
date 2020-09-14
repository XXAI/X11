<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InstitucionEducativa extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'catalogo_institucion_educativa';
}
