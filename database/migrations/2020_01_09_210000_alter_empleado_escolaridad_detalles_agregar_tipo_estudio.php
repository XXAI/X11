<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterEmpleadoEscolaridadDetallesAgregarTipoEstudio extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('empleado_escolaridad_detalles', function (Blueprint $table) {
            $table->string('tipo_estudio', 5)->after('nivel_academico_id')->nullable();
            $table->string('descripcion', 255)->nullable()->change();
            $table->smallInteger('titulado')->nullable()->comment("0 = No, 1 = Si")->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('empleado_escolaridad_detalles', function (Blueprint $table) {
            $table->dropColumn('tipo_estudio');
        });
    }
}
