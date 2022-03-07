<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTableDatosNominales extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rel_trabajador_datos_laborales_nomina', function (Blueprint $table) {
            $table->date("fecha_ingreso_federal")->after("curp_nomina")->nullable();
            $table->date("fecha_ingreso")->after("curp_nomina");
            $table->string("nombre_nomina", 250)->after("curp_nomina");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('rel_trabajador_datos_laborales_nomina', function (Blueprint $table) {
            $table->dropColumn('fecha_ingreso_federal');
            $table->dropColumn('fecha_ingreso');
            $table->dropColumn('nombre_nomina');
        });
    }
}
