<?php

namespace App\Models\Brigadista;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RelNominaBrigadista extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'rel_nomina_brigadista';
}
