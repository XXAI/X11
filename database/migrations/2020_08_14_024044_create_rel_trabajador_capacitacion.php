<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRelTrabajadorCapacitacion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rel_trabajador_capacitacion', function (Blueprint $table) {
            $table->Increments('id')->unsigned();
            $table->smallInteger('trabajador_id')->unsigned();
            $table->smallInteger('capacitacion_anual')->unsigned()->comments("1 = si, 0 = no")->default(0);
            $table->smallInteger('grado_academico')->unsigned()->comments("1 = si, 0 = no")->default(0);
            $table->mediumInteger('titulo_diploma_id')->unsigned()->nullable();
            $table->string('otro_nombre_titulo', 254)->nullable();
            $table->mediumInteger('institucion_id')->unsigned()->nullable();
            $table->string('otro_nombre_institucion', 254)->nullable();
            $table->mediumInteger('ciclo_id')->unsigned()->nullable();
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
        Schema::dropIfExists('rel_trabajador_capacitacion');
    }
}
