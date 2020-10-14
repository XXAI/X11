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
        return $this->hasOne('App\Models\RelCapacitacion');
    }

    public function datoslaborales(){
        return $this->hasOne('App\Models\RelDatosLaborales');
    }

    public function escolaridad(){
        return $this->hasMany('App\Models\RelEscolaridad');
    }

    public function escolaridadcursante(){
        return $this->hasOne('App\Models\RelEscolaridadCursante');
    }

    public function horario(){
        return $this->hasMany('App\Models\RelHorario');
    }
    
    public function nomina(){
        return $this->hasOne('App\Models\RelNomina');
    }
}
