<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RelEscolaridadCursante extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'rel_trabajador_escolaridad_cursante';

    public function tipo_ciclo_formacion(){
        return $this->belongsTo('App\Models\CicloFormacion', 'tipo_ciclo_formacion_id', 'id');
    }

    public function carrera_ciclo(){
         return $this->belongsTo('App\Models\Profesion', 'carrera_ciclo_id', 'id');
    }
    public function institucion_ciclo(){
        return $this->belongsTo('App\Models\InstitucionEducativa', 'institucion_ciclo_id', 'id');
    }

    public function anio_cursa(){
        return $this->belongsTo('App\Models\AnioCursa', 'anio_cursa_id', 'id');
    }

    public function idioma(){
        return $this->belongsTo('App\Models\Idioma', 'idioma_id', 'id');
    }

    public function nivel_idioma(){
        return $this->belongsTo('App\Models\NivelDominio', 'nivel_idioma_id', 'id');
    }

    public function lengua_indigena(){
        return $this->belongsTo('App\Models\Lengua', 'lengua_indigena_id', 'id');
    }

    public function colegio(){
        return $this->belongsTo('App\Models\Colegio', 'colegio_id', 'id');
    }
}
