<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class importarTramites extends Model
{
    protected $fillable = ['rfc', 'nombre_completo','clues','cr_destino', 'codigo', 'adscripcion', 'fecha_oficio', 'fecha_inicio', 'fecha_fin', 'tipo', 'fecha_aplicacion', 'adjudicado', 'user_id'];
    protected $table = 'importar_tramites';
}
