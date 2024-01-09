<?php

namespace App\Models\Brigadista;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubBrigadista extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'subbrigadista';

    public function mes(){
        return $this->hasMany('App\Models\Brigadista\RelSubbrigadistaMes', 'subbrigadista_id');
    }

    public function brigadista(){
        return $this->belongsTo('App\Models\Brigadista\Brigadista', 'brigadista_id');
    }
}
