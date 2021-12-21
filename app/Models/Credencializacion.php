<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Credencializacion extends Model
{
    use SoftDeletes;
    protected $fillable = ['tipo_sangre_id'];
    protected $table = 'rel_trabajador_credencial';

    public function cargo(){
        return $this->hasOne('App\Models\Cargo','id','cargo_id');
    }
}
