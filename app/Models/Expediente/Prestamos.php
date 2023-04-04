<?php

namespace App\Models\Expediente;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Prestamos extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'rel_trabajador_expediente';

    public function prestador(){
        return $this->belongsTo('App\Models\User', 'trabajador_prestador_id');
    }
    public function prestamista(){
        return $this->belongsTo('App\Models\Trabajador', 'trabajador_prestamista_id');
    }
}
