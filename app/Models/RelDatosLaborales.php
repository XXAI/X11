<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RelDatosLaborales extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $hidden = ["created_at", "updated_at", "deleted_at"];
    protected $table = 'rel_trabajador_datos_laborales';


    public function clues_fisico(){
        return $this->belongsTo('App\Models\Clues', 'clues_adscripcion_fisica', 'clues');
    }

    public function actividad(){
        return $this->belongsTo('App\Models\Actividad');
    }

    public function actividad_voluntaria(){
        return $this->belongsTo('App\Models\ActividadVoluntaria');
    }

    public function area_trabajo(){
        return $this->belongsTo('App\Models\AreaTrabajo');
    }
    public function cr_fisico(){
        return $this->belongsTo('App\Models\Cr', 'cr_fisico_id', 'cr');
    }

    public function jornada(){
        return $this->belongsTo('App\Models\Jornada', 'jornada_id');
    }

    
    // public function motivo(){
    //     return $this->belongsTo('App\Models\Motivo');
    // }
    public function programa(){
        return $this->belongsTo('App\Models\Programa');
    }
    public function rama(){
        return $this->belongsTo('App\Models\Rama');
    }
    public function temporalidad(){
        return $this->belongsTo('App\Models\Temporalidad');
    }
    public function tipo_comision(){
        return $this->belongsTo('App\Models\TipoComision');
    }
    public function tipo_personal(){
        return $this->belongsTo('App\Models\TipoPersonal');
    }
    public function unidad_administadora(){
        return $this->belongsTo('App\Models\UnidadAdministradora');
    }
    public function vigencia(){
        return $this->belongsTo('App\Models\Vigencia');
    }
    

}
