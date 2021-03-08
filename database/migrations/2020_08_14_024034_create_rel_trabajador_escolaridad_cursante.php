<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRelTrabajadorEscolaridadCursante extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rel_trabajador_escolaridad_cursante', function (Blueprint $table) {
            $table->Increments('id')->unsigned();
            $table->smallInteger('trabajador_id')->unsigned();
            $table->mediumInteger('tipo_ciclo_formacion_id')->unsigned()->nullable();
            $table->mediumInteger('carrera_ciclo_id')->unsigned()->nullable();
            $table->mediumInteger('institucion_ciclo_id')->unsigned()->nullable();
            $table->mediumInteger('anio_cursa_id')->unsigned()->nullable();
            $table->smallInteger('colegiacion')->unsigned()->comments("1 = si, 0 = no")->default(0);
            $table->mediumInteger('colegio_id')->unsigned()->nullable();
            $table->smallInteger('certificacion')->unsigned()->comments("1 = si, 0 = no")->default(0);
            $table->mediumInteger('certificacion_id')->unsigned()->nullable();
            $table->string('consejo', 254)->nullable();
           
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
        Schema::dropIfExists('rel_trabajador_escolaridad_cursante');
    }
}
