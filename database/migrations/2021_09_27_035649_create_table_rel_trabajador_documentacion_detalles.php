<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableRelTrabajadorDocumentacionDetalles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rel_trabajador_documentacion_detalles', function (Blueprint $table) {
            $table->Increments('id')->unsigned();
            $table->smallInteger('rel_trabajador_documentacion_id')->unsigned()->index('rel_documentacion_id');
            $table->smallInteger('tipo_id')->unsigned()->index('tipo_requerimiento_id');
            //$table->unique(['documentacion_detalles_id', 'rel_documentacion_id'. 'tipo_requerimiento_id']);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rel_trabajador_documentacion_detalles');
    }
}
