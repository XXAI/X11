<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterEmpleadoBajaAgregarObservaciones extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('empleado_baja', function (Blueprint $table) {
            $table->text('observaciones')->nullable()->after('fecha_baja');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('empleado_baja', function (Blueprint $table) {
            $table->dropColumn('observaciones');
        });
    }
}
