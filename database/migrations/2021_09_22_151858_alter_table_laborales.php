<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableLaborales extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rel_trabajador_datos_laborales_nomina', function (Blueprint $table) {
            $table->string('curp', 50)->nullable()->after('trabajador_id')->index();
            $table->string('rfc', 15)->nullable()->after('trabajador_id')->index();
            $table->string('tipo_personal', 100)->nullable()->after('institucion_id');
            $table->string('fuente_financiamiento', 150)->nullable()->after('numero_empleado');
            $table->string('clave_presupuestal', 100)->nullable()->after('numero_empleado');
            $table->string('rama', 100)->nullable()->after('numero_empleado');
            $table->string('programa', 100)->nullable()->after('numero_empleado');
            
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
            $table->dropColumn('rfc');
            $table->dropColumn('curp');
            $table->dropColumn('tipo_personal');
            $table->dropColumn('fuente_financiamiento');
            $table->dropColumn('clave_presupuestal');
            $table->dropColumn('rama');
            $table->dropColumn('programa');
        });
    }
}
