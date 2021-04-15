<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RelComision extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'rel_trabajador_comision';

    public function sindicato(){
        return $this->belongsTo('App\Models\Sindicato', 'sindicato_id', 'id');
    }
}
