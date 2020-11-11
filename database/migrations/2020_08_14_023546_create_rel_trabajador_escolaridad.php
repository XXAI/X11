<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRelTrabajadorEscolaridad extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rel_trabajador_escolaridad', function (Blueprint $table) {
            $table->Increments('id')->unsigned();
            $table->smallInteger('trabajador_id')->unsigned();
            $table->mediumInteger('grado_academico_id')->unsigned()->nullable();
            $table->mediumInteger('nombre_estudio_id')->unsigned()->nullable();
            $table->string('otro_nombre_estudio', 254)->nullable();
            $table->mediumInteger('institucion_id')->unsigned()->nullable();
            $table->string('otro_nombre_institucion', 254)->nullable();
            $table->smallInteger('cedula')->default(0)->unsigned()->comments("1 = si, 0 = no");
            $table->smallInteger('no_cedula')->unsigned()->nullable();
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
        Schema::dropIfExists('rel_trabajador_escolaridad');
    }
}
