<?php

namespace App\Models\Brigadista;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Brigadista extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'brigadista';

    public function mes(){
        return $this->hasMany('App\Models\Brigadista\RelBrigadistaMes');
    }
}
