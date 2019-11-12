<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Empleado extends Model
{
    use SoftDeletes;
    protected $fillable = ["codigo_id", "comision_sindical_id", "cr_id","curp", "figf", "fissa", "fuente_id", "horario", "nombre", "programa_id", "rama_id", "rfc", "tipo_nomina_id", "validado"];
    protected $table = 'empleados';

    public function sindicato(){
        return $this->hasOne('App\Models\Sindicato','id','comision_sindical_id');
    }

    public function codigo(){
        return $this->hasOne('App\Models\Codigo','codigo','codigo_id');
    }

    public function clues(){
        return $this->hasOne('App\Models\Clues', 'clues', "clues");
    }

    public function adscripcionActiva(){
        return $this->hasOne('App\Models\CluesEmpleado', 'empleado_id', "id")->whereNull('fecha_fin');
    }

    public function adscripcionHistorial(){
        return $this->hasMany('App\Models\CluesEmpleado', 'empleado_id', "id");
    }

    public function permutaAdscripcionActiva(){
        return $this->hasOne('App\Models\PermutaAdscripcion', 'empleado_id', "id")->where('estatus',1);
    }

    public function permutasAdscripcion(){
        return $this->hasMany('App\Models\PermutaAdscripcion', 'empleado_id', "id");
    }

    public function escolaridad(){
        return $this->hasOne('App\Models\EmpleadoEscolaridad', 'empleado_id', "id");
    }
}
