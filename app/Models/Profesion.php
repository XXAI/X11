<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Profesion extends Model
{
    use SoftDeletes;
    protected $fillable = ['descripcion','tipo_profesion_id','rama_id'];
    protected $table = 'catalogo_profesion';

    public function tipoProfesion(){
        return $this->hasOne('App\Models\TipoProfesion', 'id', "tipo_profesion_id");
    }

    public function rama(){
        return $this->hasOne('App\Models\Rama','id','rama_id');
    }
}
