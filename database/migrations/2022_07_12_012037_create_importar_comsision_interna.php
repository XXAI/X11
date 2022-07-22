<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateImportarComsisionInterna extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('importar_tramites', function (Blueprint $table) {
            $table->smallInteger('trabajador_id')->unsigned();
            $table->string("cr_origen",15);
            
            
            $table->string("rfc", 13)->nullable();
            $table->string("nombre_completo", 200)->nullable();
            $table->string("clues",11)->nullable();
            $table->string("cr_destino",15);
            $table->string("codigo",10)->nullable();
            $table->string("adscripcion",240)->nullable();

            $table->date('fecha_oficio')->nullable();
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();
            $table->date('fecha_aplicacion')->nullable();
            $table->smallInteger("adjudicado")->default(0);
            
            $table->smallInteger("tipo")->default(1)->comment("1->comisión interna, 2-> cambio adscripcion, 3-> reincorporacion, 4-> comisión externa, 5->permuta");
            $table->smallInteger("estatus")->default(1)->comment("1->correcto, 2-> trabajador no encontrado, 3-> destino no encontrado, 4-> nomina no encontrado, 5->fechas incorrectas, 6->destino y origen iguales");
            $table->smallInteger("user_id");
            $table->string("observaciones", 250);
            
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('rel_trabajador_comision_interna', function (Blueprint $table) {
           
            $table->dropColumn('fecha_respuesta_origen');
            $table->dropColumn('fecha_respuesta_destino');
            $table->dropColumn('fecha_respuesta_validacion');
            $table->dropColumn('estatus_origen');
            $table->dropColumn('estatus_destino');
            $table->dropColumn('estatus_validacion');
            $table->dropColumn('user_origen_id');
            $table->dropColumn('user_destino_id');
            $table->dropColumn('user_validacion_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('importar_tramites');
        Schema::create('rel_trabajador_comision_interna', function (Blueprint $table) {
           
            $table->date("fecha_respuesta_origen")->nullable();
            $table->date("fecha_respuesta_destino")->nullable();
            $table->date("fecha_respuesta_validacion")->nullable();
            $table->smallInteger('estatus_origen')->unsigned();
            $table->smallInteger('estatus_destino')->unsigned();
            $table->smallInteger('estatus_validacion')->unsigned();
            $table->string('user_origen_id',15);
            $table->string('user_destino_id',15);
            $table->string('user_validacion_id',15);
        });
    }
}
