<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableComisionInterna extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rel_trabajador_comision_interna', function (Blueprint $table) {
            $table->Increments('id')->unsigned();
            $table->smallInteger('trabajador_id')->unsigned();
            $table->string("cr_origen",15);
            $table->string("cr_destino",15);
            $table->date('fecha_oficio');
            $table->date('fecha_inicio');
            $table->date('fecha_fin');
            $table->date('fecha_respuesta_origen')->nullable();
            $table->date('fecha_respuesta_destino')->nullable();
            $table->date('fecha_respuesta_validacion')->nullable();

            $table->smallInteger('estatus_origen')->default(0);
            $table->smallInteger('estatus_destino')->default(0);
            $table->smallInteger('estatus_validacion')->default(0);

            $table->string('user_origen_id',15)->nullable();
            $table->string('user_destino_id',15)->nullable();
            $table->string('user_validacion_id',15)->nullable();
            
            $table->smallInteger("adjudicado")->default(0);
            $table->smallInteger("activo")->default(1);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('rel_trabajador_adscripcion_externa', function (Blueprint $table) {
            $table->Increments('id')->unsigned();
            $table->string("nombre",250);
            $table->string("codigo",100);
            $table->string("adscripcion",250);
            $table->string("cr_destino",15);
            $table->date('fecha_oficio');
            $table->date('fecha_cambio');
            
            $table->smallInteger("adjudicado")->default(0);
            $table->smallInteger("activo")->default(1);
            $table->timestamps();
            $table->softDeletes();
        });
        //Schema::dropIfExists('rel_trabajador_tramite');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rel_trabajador_comision_interna');
        Schema::dropIfExists('rel_trabajador_adscripcion_externa');
        
    }
}
