<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PermutaAdscripcion extends Model
{
    use SoftDeletes;
    protected $fillable = ['empleado_id', 'user_origen_id', 'clues_origen', 'user_destino_id', 'clues_destino', 'observacion', 'estatus', 'user_id'];
    protected $table = 'permuta_adscripcion';

    public function empleado(){
        return $this->hasOne('App\Models\Empleado', 'id', "empleado_id");
    }

    public function cluesOrigen(){
        return $this->hasOne('App\Models\Clues', 'clues', "clues_origen");
    }

    public function cluesDestino(){
        return $this->hasOne('App\Models\Clues', 'clues', "clues_destino");
    }
}
