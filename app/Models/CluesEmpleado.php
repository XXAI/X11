<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CluesEmpleado extends Model
{
    use SoftDeletes;
    protected $fillable = ['empleado_id','clues','fecha_inicio','fecha_fin'];
    protected $table = 'clues_empleado';

    public function clues(){
        return $this->hasOne('App\Models\Clues', 'clues', "clues");
    }

    public function empleado(){
        return $this->hasOne('App\Models\Empleado', 'id', "empleado_id");
    }
}
