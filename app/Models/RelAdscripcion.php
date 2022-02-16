<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RelAdscripcion extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'rel_trabajador_adscripcion';

    public function trabajador(){
        return $this->belongsTo('App\Models\Trabajador', 'trabajador_id', 'id');
    }

    public function cr_origen(){
        return $this->belongsTo('App\Models\Cr', 'cr_origen', 'cr')->with("clues");
    }

    public function cr_destino(){
        return $this->belongsTo('App\Models\Cr', 'cr_destino', 'cr')->with("clues");
    }
}
