<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RelCapacitacionDetalles extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'rel_trabajador_capacitacion_detalles';

    public function entidad_nacimiento(){
        return $this->belongsTo('App\Models\Entidad', 'entidad_id', 'id');
    }

    public function cursos(){
        return $this->belongsTo('App\Models\Cursos', 'nombre_curso_id', 'id');
    }
}
