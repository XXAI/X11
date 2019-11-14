<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterEmpleadosAgregarVariosCampos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('empleados', function (Blueprint $table) {
            $table->dropColumn('horario');
            
            $table->time('hora_salida')->nullable()->after('proporcionado_por');
            $table->time('hora_entrada')->nullable()->after('proporcionado_por');

            $table->text('observaciones')->nullable()->after('validado');
            $table->string('area_servicio')->nullable()->after('cr_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('empleados', function (Blueprint $table) {
            $table->string('horario')->after('proporcionado_por')->nullable();
            $table->dropColumn('hora_entrada');
            $table->dropColumn('hora_salida');
            $table->dropColumn('observaciones');
            $table->dropColumn('area_servicio');
        });
    }
}
