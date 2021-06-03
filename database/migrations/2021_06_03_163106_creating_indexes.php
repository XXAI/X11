<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatingIndexes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rel_trabajador_escolaridad',function(Blueprint $table){
            $table->index('grado_academico_id');
            $table->index('trabajador_id');
            $table->index('nombre_estudio_id');
        });

        Schema::table('trabajador',function(Blueprint $table){
            $table->index('sexo_id');
            $table->index('pais_nacimiento_id');
            $table->index('entidad_nacimiento_id');
            $table->index('nivel_maximo_id');
        });

        Schema::table('rel_trabajador_horario',function(Blueprint $table){
            $table->index('trabajador_id');
        });

        Schema::table('rel_trabajador_datos_laborales',function(Blueprint $table){
            $table->index('trabajador_id');
            $table->index('clues_adscripcion_fisica');
            $table->index('cr_fisico_id');
            $table->index('area_trabajo_id');
            $table->index('rama_id');
            $table->index('jornada_id');
        });

        Schema::table('rel_trabajador_datos_laborales_nomina',function(Blueprint $table){
            $table->index('tipo_nomina_id');
            $table->index('tipo_contrato_id');
            $table->index('codigo_puesto_id');
            $table->index('trabajador_id');
        });

        Schema::table('catalogo_profesion',function(Blueprint $table){
            $table->index('clave_sinergias');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('rel_trabajador_escolaridad',function(Blueprint $table){
            $table->dropIndex(['grado_academico_id']);
            $table->dropIndex(['trabajador_id']);
            $table->dropIndex(['nombre_estudio_id']);
        });

        Schema::table('trabajador',function(Blueprint $table){
            $table->dropIndex(['sexo_id']);
            $table->dropIndex(['pais_nacimiento_id']);
            $table->dropIndex(['entidad_nacimiento_id']);
            $table->dropIndex(['nivel_maximo_id']);
        });

        Schema::table('rel_trabajador_horario',function(Blueprint $table){
            $table->dropIndex(['trabajador_id']);
        });

        Schema::table('rel_trabajador_datos_laborales',function(Blueprint $table){
            $table->dropIndex(['trabajador_id']);
            $table->dropIndex(['clues_adscripcion_fisica']);
            $table->dropIndex(['cr_fisico_id']);
            $table->dropIndex(['area_trabajo_id']);
            $table->dropIndex(['rama_id']);
            $table->dropIndex(['jornada_id']);
        });

        Schema::table('rel_trabajador_datos_laborales_nomina',function(Blueprint $table){
            $table->dropIndex(['tipo_nomina_id']);
            $table->dropIndex(['tipo_contrato_id']);
            $table->dropIndex(['codigo_puesto_id']);
            $table->dropIndex(['trabajador_id']);
        });
        
        Schema::table('catalogo_profesion',function(Blueprint $table){
            $table->dropIndex(['clave_sinergias']);
        });
    }
}
