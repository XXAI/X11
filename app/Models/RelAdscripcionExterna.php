<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class RelAdscripcionExterna extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'rel_trabajador_adscripcion_externa';

    public function cr_destino(){
        return $this->belongsTo('App\Models\Cr', 'cr_destino', 'cr')->with("clues");
    }
}
