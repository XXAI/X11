<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRelTrabajadorDatosLaborales extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rel_trabajador_datos_laborales', function (Blueprint $table) {
            $table->smallIncrements('id')->unsigned();
            $table->smallInteger('trabajador_id')->unsigned();
            $table->mediumInteger('actividad_id')->unsigned()->nullable();
            $table->mediumInteger('actividad_voluntaria_id')->unsigned()->nullable();
            $table->mediumInteger('area_trabajo_id')->unsigned()->nullable();
            $table->mediumInteger('tipo_personal_id')->unsigned()->nullable();
            //$table->smallInteger('codigo_puesto_id')->unsigned()->nullable();//Descripcion va en el catalogo
            $table->date('fecha_ingreso')->nullable();
            $table->date('fecha_ingreso_federal')->nullable();
            $table->string('clues_adscripcion_fisica')->nullable();
           
            $table->mediumInteger('vigencia_id')->unsigned()->nullable();
            $table->mediumInteger('motivo_id')->unsigned()->nullable();//Checar
            $table->mediumInteger('temporalidad_id')->unsigned()->nullable();
            $table->smallInteger('seguro_salud')->unsigned()->comments("1 = si, 0 = no")->nullable();
            $table->smallInteger('licencia_maternidad')->unsigned()->comments("1 = si, 0 = no")->nullable();
            $table->smallInteger('seguro_retiro')->unsigned()->comments("1 = si, 0 = no")->nullable();
            $table->mediumInteger('jornada_id')->unsigned()->nullable();
            $table->smallInteger('recurso_formacion')->unsigned()->comments("1 = si, 0 = no")->nullable();
            $table->smallInteger('tiene_fiel')->unsigned()->comments("1 = si, 0 = no")->nullable();
            $table->date('vigencia_fiel')->nullable();
            $table->smallInteger('comision')->unsigned()->comments("1 = si, 0 = no")->nullable();
            $table->string('tipo_comision_id')->comments("CI = COMISION INTERNA, CS = COMISION SINDICAL")->nullable();
            //Checar            
            $table->smallInteger('programa_id')->unsigned()->nullable();
            $table->string('cr_fisico_id', 15)->nullable();
            $table->text('actividades')->nullable();
            $table->smallInteger('rama_id')->unsigned()->nullable();

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
        Schema::dropIfExists('rel_trabajador_datos_laborales');
    }
}
