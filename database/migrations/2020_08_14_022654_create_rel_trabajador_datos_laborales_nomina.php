<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRelTrabajadorDatosLaboralesNomina extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rel_trabajador_datos_laborales_nomina', function (Blueprint $table) {
            $table->smallIncrements('id')->unsigned();
            $table->smallInteger('trabajador_id')->unsigned();
            $table->smallInteger('institucion_id')->unsigned()->nullable();
            $table->string('codigo_puesto_id')->nullable();
            $table->string('numero_empleado', 50)->nullable();
            $table->string('clues_adscripcion_nomina')->nullable();
            $table->smallInteger('entidad_federativa_puesto_id')->unsigned()->nullable();
            $table->smallInteger('tipo_contrato_id')->unsigned()->nullable();
            $table->smallInteger('tipo_plaza_id')->unsigned()->nullable();
            $table->smallInteger('institucion_puesto_id')->unsigned()->nullable();
            $table->string('ur', 100)->nullable();
            $table->smallInteger('tipo_nomina_id')->unsigned()->nullable();
            $table->smallInteger('fuente_id')->unsigned()->nullable();
            $table->smallInteger('fuente_finan_id')->unsigned()->nullable();
            $table->string('cr_nomina_id', 15)->nullable();            

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
        Schema::dropIfExists('rel_trabajador_datos_laborales_nomina');
    }
}
