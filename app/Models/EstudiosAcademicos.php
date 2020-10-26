<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class EstudiosAcademicos extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $hidden = ["created_at", "updated_at", "deleted_at"];
    protected $table = 'catalogo_estudios_academicos';
}
