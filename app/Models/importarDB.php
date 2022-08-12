<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class importarDB extends Model
{
    use SoftDeletes;
    protected $fillable = ['rfc_nomina', 'curp_nomina', 'nombre_nomina', 'fecha_ingreso','fecha_ingreso_federal', 'codigo_puesto_id','rama','clave_presupuestal','fuente_financiamiento','clues_adscripcion_nomina','ur','cr_nomina_id'];
    protected $table = 'importar_nomina';
}
