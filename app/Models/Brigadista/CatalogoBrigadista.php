<?php

namespace App\Models\Brigadista;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CatalogoBrigadista extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'catalogo_brigadista';
}
