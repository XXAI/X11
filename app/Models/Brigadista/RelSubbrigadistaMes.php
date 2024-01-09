<?php

namespace App\Models\Brigadista;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RelSubbrigadistaMes extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'rel_subbrigadista_mes';
}
