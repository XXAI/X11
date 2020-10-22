<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RelEscolaridad extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'rel_trabajador_escolaridad';

    public function grado_academico(){
        return $this->belongsTo('App\Models\GradoAcademico', 'grado_academico_id', 'id');
    }

    public function institucion(){
        return $this->belongsTo('App\Models\InstitucionEducativa', 'institucion_id', 'id');
    }

}
