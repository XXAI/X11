<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Empleado extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'empleados';

    public function clues(){
        return $this->hasOne('App\Models\Clues', 'clues', "clues");
    }

    public function adscripcionActiva(){
        return $this->hasOne('App\Models\CluesEmpleado', 'empleado_id', "id")->whereNull('fecha_fin');
    }

    public function adcripcionHistorial(){
        return $this->hasMany('App\Models\CluesEmpleado', 'empleado_id', "id");
    }

    public function permutaAdscripcionActiva(){
        return $this->hasOne('App\Models\PermutaAdscripcion', 'empleado_id', "id")->where('estatus',1);
    }

    public function permutasAdscripcion(){
        return $this->hasMany('App\Models\PermutaAdscripcion', 'empleado_id', "id");
    }
}
