<?php

namespace App\Models\Catalogos\Clues;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MovimientoCluesCr extends Model
{
    use SoftDeletes;
    protected $fillable = ['fecha_movimiento', 'user_id', 'clues_before', 'descripcion_before', 'cr_before', 'clues_after', 'descripcion_after', 'cr_after','descripcion'];

    protected $table = 'mov_clues_cr';
}
