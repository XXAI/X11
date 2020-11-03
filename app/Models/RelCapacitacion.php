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

    public function institucion(){
        return $this->belongsTo('App\Models\InstitucionEducativa', 'institucion_id', 'id');
    }

    public function titulo_capacitacion(){
        return $this->belongsTo('App\Models\Profesion', 'titulo_diploma_id', 'id');
    }
}
