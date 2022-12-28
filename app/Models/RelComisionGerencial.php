<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RelComisionGerencial extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'rel_trabajador_comision_gerencial';

    public function trabajador(){
        return $this->belongsTo('App\Models\Trabajador', 'trabajador_id', 'id');
    }

    public function cr_origen(){
        return $this->belongsTo('App\Models\Cr', 'cr_origen', 'cr')->with("clues");
    }

    public function codigo(){
        return $this->belongsTo('App\Models\Codigo', 'codigo_id', 'codigo');
    }

    public function responsable(){
        return $this->belongsTo('App\Models\Trabajador', 'trabajador_responsable_id', 'id');
    }
}
