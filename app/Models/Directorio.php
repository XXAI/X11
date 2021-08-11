<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Directorio extends Model
{
    use SoftDeletes;
    //protected $primaryKey = 'cr';
    protected $fillable = ['cr', 'tipo_responsable_id', 'trabajador_id', 'cargo'];
    protected $table = 'rel_trabajador_cr_responsables';

    public function responsable(){
        return $this->belongsTo('App\Models\trabajador', 'trabajador_id','id');
    }
}
