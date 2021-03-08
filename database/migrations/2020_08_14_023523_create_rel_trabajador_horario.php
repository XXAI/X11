<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRelTrabajadorHorario extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rel_trabajador_horario', function (Blueprint $table) {
            $table->smallIncrements('id')->unsigned();
            $table->smallInteger('trabajador_id')->unsigned();
            $table->smallInteger('dia')->unsigned();
            $table->time('entrada')->nullable();
            $table->time('salida')->nullable();
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
        Schema::dropIfExists('rel_trabajador_horario');
    }
}
