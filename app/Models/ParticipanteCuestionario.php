<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ParticipanteCuestionario extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $table = 'participante_cuestionario';
}
