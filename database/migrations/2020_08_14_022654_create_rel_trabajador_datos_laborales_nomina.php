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
            $table->mediumInteger('institucion_id')->default(1)->unsigned()->nullable();
            $table->string('codigo_puesto_id')->nullable();
            $table->mediumInteger('codigo_puesto_sinerhias')->nullable();
            $table->string('descripcion_puesto', 254)->nullable();
            $table->string('numero_empleado', 50)->nullable();
            $table->string('clues_adscripcion_nomina')->nullable();
            $table->mediumInteger('entidad_federativa_puesto_id')->default(7)->unsigned()->nullable();
            $table->mediumInteger('tipo_contrato_id')->unsigned()->nullable();
            $table->mediumInteger('tipo_plaza_id')->unsigned()->nullable();
            $table->mediumInteger('institucion_puesto_id')->default(1)->unsigned()->nullable();
            $table->string('ur', 100)->nullable();
            $table->mediumInteger('unidad_administradora_id')->default(2032563)->unsigned()->nullable();
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
