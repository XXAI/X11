<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RelCapacitacion extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'rel_trabajador_capacitacion';

    public function detalles(){
        return $this->hasMany('App\Models\RelCapacitacionDetalles');
    }

    public function grado_academico(){
        return $this->belongsTo('App\Models\GradoAcademico', 'grado_academico', 'id');
    }

    public function titulo_diploma(){
        return $this->belongsTo('App\Models\GradoAcademico', 'titulo_diploma_id', 'id');
    }

    public function institucion(){
        return $this->belongsTo('App\Models\InstitucionEducativa', 'institucion_id', 'id');
    }

}
