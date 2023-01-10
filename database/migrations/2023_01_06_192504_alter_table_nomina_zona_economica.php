<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTableNominaZonaEconomica extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rel_trabajador_datos_laborales_nomina', function (Blueprint $table) {
            $table->string('ze',4)->after("ur");
            $table->date('fecha_actualizacion')->after("cr_nomina_id");
            $table->string('clabe',100)->after("clave_presupuestal");
            $table->string('num_cuenta',100)->after("clave_presupuestal");
        });
        Schema::table('importar_nomina', function (Blueprint $table) {
            $table->string('tipo_personal',50)->after("fecha_ingreso_federal");
            $table->string('programa',100)->after("codigo_puesto_id");
            $table->string('num_empleado',50)->after("codigo_puesto_id");
            $table->string('descripcion_puesto',100)->after("codigo_puesto_id");
            $table->string('clabe',100)->after("clave_presupuestal");
            $table->string('num_cuenta',100)->after("clave_presupuestal");
            $table->string('ze',4)->after("ur");
            $table->date('fecha_actualizacion')->after("cr_nomina_id");
            
        });

        Schema::table('catalogo_cr', function (Blueprint $table) {
            $table->string('ze',4)->after("descripcion_actualizada");    
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
            $table->dropColumn("ze");
            $table->dropColumn("fecha_actualizacion");
            $table->dropColumn("clabe");
            $table->dropColumn("num_cuenta");
        });

        Schema::table('importar_nomina', function (Blueprint $table) {
            $table->dropColumn('tipo_personal');
            $table->dropColumn('programa');
            $table->dropColumn('num_empleado');
            $table->dropColumn('descripcion_puesto');
            $table->dropColumn('clabe');
            $table->dropColumn('num_cuenta');
            $table->dropColumn('ze');
            $table->dropColumn('fecha_actualizacion');
            
        });

        Schema::table('catalogo_cr', function (Blueprint $table) {
            $table->dropColumn('ze');   
        });
    }
}
