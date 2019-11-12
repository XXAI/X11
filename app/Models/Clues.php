<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Clues extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'catalogo_clues';

    public function cr(){
        return $this->hasMany('App\Models\Cr','clues','clues');
    }
}
