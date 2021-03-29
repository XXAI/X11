<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RelDatosLaboralesNomina extends Model
{
    use SoftDeletes;
    protected $fillable = [''];
    protected $hidden = ["created_at", "updated_at", "deleted_at"];
    protected $table = 'rel_trabajador_datos_laborales_nomina';


    public function clues(){
        return $this->belongsTo('App\Models\Clues', 'clues_adscripcion_nomina', 'clues');
    }

    public function cr(){
        return $this->belongsTo('App\Models\Cr', 'cr_nomina_id', 'cr');
    }

   

    public function codigo(){
        return $this->belongsTo('App\Models\Codigo', 'codigo_puesto_id', 'codigo');
    }

    public function tipoNomina(){
        return $this->belongsTo('App\Models\TipoNomina', 'tipo_nomina_id', 'id');
    }
    
}
