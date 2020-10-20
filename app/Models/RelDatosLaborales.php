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


    public function clues_adscripcion(){
        return $this->belongsTo('App\Models\Clues', 'clues_adscripcion_fisica', 'clues');
    }

}
