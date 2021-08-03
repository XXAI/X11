<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableRelTrabajadorTramite extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('rel_trabajador_tramites')){
            Schema::create('rel_trabajador_tramites', function (Blueprint $table) {
                $table->Increments('id')->unsigned();
                $table->smallInteger('trabajador_id')->unsigned();
                $table->smallInteger('tipo_tramite_id')->unsigned();
                $table->date("fecha_inicio")->nullable();
                $table->date("fecha_final")->nullable();

                $table->string("cr_origen",15);
                $table->date("fecha_respuesta_origen")->nullable();
                $table->smallInteger('estatus_origen')->unsigned();
                $table->string('user_origen_id',15);
                $table->string('cr_firmante_origen',15);
                
                $table->string("cr_destino",15);
                $table->date("fecha_respuesta_destino")->nullable();
                $table->smallInteger('estatus_destino')->unsigned();
                $table->string('user_destino_id',15);
                $table->string('cr_firmante_destino',15);
                
                $table->string("cr_validacion",15);
                $table->date("fecha_respuesta_validacion")->nullable();
                $table->smallInteger('estatus_validacion')->unsigned();
                $table->string('user_validacion_id',15);
                
                $table->timestamps();
                $table->softDeletes();
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('table_rel_trabajador_tramite');
    }
}
