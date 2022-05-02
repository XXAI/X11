<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SatRegimen extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'catalogo_sat_regimen';
}
