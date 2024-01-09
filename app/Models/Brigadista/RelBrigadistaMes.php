<?php

namespace App\Models\Brigadista;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RelBrigadistaMes extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'rel_brigadistas_mes';
}
