<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Trabajador extends Model
{
    use SoftDeletes;
    //protected $fillable = ['descripcion'];
    protected $table = 'trabajador';

    public function capacitacion(){
        return $this->hasOne('App\Models\RelCapacitacion')->with('institucion', 'titulo_capacitacion');
    }

    public function capacitacionDetalles(){
        return $this->hasMany('App\Models\RelCapacitacionDetalles')->with('cursos', 'entidad');
    }

    public function datoslaborales(){
        return $this->hasOne('App\Models\RelDatosLaborales')->with('clues_fisico', 'cr_fisico');
    }
    
    public function datoslaboralesnomina(){
        return $this->hasOne('App\Models\RelDatosLaboralesNomina')->with('clues', 'cr');
    }
    

    public function escolaridad(){
        return $this->hasMany('App\Models\RelEscolaridad')->with('grado_academico', 'institucion', 'nombre_estudio');
    }

    public function escolaridadcursante(){
        return $this->hasOne('App\Models\RelEscolaridadCursante')->with('colegio', 'carrera_ciclo', 'institucion_ciclo');
    }

    public function horario(){
        return $this->hasMany('App\Models\RelHorario');
    }
    
    public function nomina(){
        return $this->hasOne('App\Models\RelNomina');
    }

    //catalogos
    public function pais_nacimiento(){
        return $this->belongsTo('App\Models\Pais');
    }

    public function entidad_nacimiento(){
        return $this->belongsTo('App\Models\Entidad');
    }
    public function municipio_nacimiento(){
        return $this->belongsTo('App\Models\Municipio', 'municipio_nacimiento_id');
    }

    public function nacionalidad(){
        return $this->belongsTo('App\Models\Nacionalidad');
    }

    public function estado_conyugal(){
        return $this->belongsTo('App\Models\EstadoConyugal');
    }

    public function sexo(){
        return $this->belongsTo('App\Models\Sexo');
    }
    public function entidad_federativa(){
        return $this->belongsTo('App\Models\Entidad');
    }
    public function municipio_federativo(){
        return $this->belongsTo('App\Models\Municipio');
    }

    //Ver trabajador
    public function rel_trabajador_capacitacion(){
        return $this->hasOne('App\Models\RelCapacitacion')->with('grado_academico', 'titulo_diploma', 'institucion');
    }
    public function rel_trabajador_capacitacion_detalles(){
        return $this->hasMany('App\Models\RelCapacitacionDetalles')->with('entidad_nacimiento', 'cursos');
    }
    public function rel_datos_laborales(){
        return $this->hasOne('App\Models\RelDatosLaborales')->with('clues_adscripcion','actividad','actividad_voluntaria','area_trabajo','cr_fisico','programa','rama');
    }

    public function rel_trabajador_escolaridad(){
        return $this->hasMany('App\Models\RelEscolaridad')->with('grado_academico', 'institucion', 'nombre_estudio');
    }
    public function rel_trabajador_escolaridad_cursante(){
        return $this->hasOne('App\Models\RelEscolaridadCursante')->with('tipo_ciclo_formacion', 'carrera_ciclo', 'certificado', 'colegio', 'institucion_ciclo', 'anio_cursa', 'idioma', 'nivel_idioma', 'lengua_indigena', 'nivel_lengua');
    }
    public function rel_trabajador_horario(){
        return $this->hasMany('App\Models\RelHorario');
    }

}