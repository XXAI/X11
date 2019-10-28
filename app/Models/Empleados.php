<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Empleados extends Model
{
    use SoftDeletes;
    protected $fillable = [''];

    public function clues()
    {
        return $this->hasOne('App\Models\Clues', 'clues', "clues");
    }
}
