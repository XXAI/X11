<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RelDocumentacionDetalles extends Model
{
    use SoftDeletes;
    protected $fillable = ['rel_trabajador_documentacion_id', "tipo_id"];
    protected $table = 'rel_trabajador_documentacion_detalles';

    
}
