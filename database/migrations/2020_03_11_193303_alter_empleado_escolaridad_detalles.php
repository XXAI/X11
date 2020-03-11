<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterEmpleadoEscolaridadDetalles extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('empleado_escolaridad_detalles', function (Blueprint $table) {
            $table->smallinteger('titulo_id')->nullable()->after('empleado_id');
            $table->string('titulo_otro', 255)->after('empleado_id');
            $table->smallinteger('cedula')->comments("0 no, 1 si")->default(0)->after('empleado_id');
            $table->string('institucion_otro', 255)->after('empleado_id');
            $table->smallinteger('institucion_id')->nullable()->after('empleado_id');
            $table->smallinteger('grado_academico_id')->unsigned()->nullable()->after('empleado_id');
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
            $table->dropColumn('titulo_id');
            $table->dropColumn('titulo_otro');
            $table->dropColumn('cedula');
            $table->dropColumn('institucion_otro');
            $table->dropColumn('institucion_id');
            $table->dropColumn('grado_academico_id');
        });
    }
}
