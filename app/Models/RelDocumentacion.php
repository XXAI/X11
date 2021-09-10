<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RelDocumentacion extends Model
{
    use SoftDeletes;
    protected $table = 'rel_trabajador_documentacion';
}
