<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterEmpleadosAgregarFuenteFinanciamientoNuevoCat extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('empleados', function (Blueprint $table) {
            $table->string('fuente_finan_id',4)->after('fuente_id')->nullable();
            $table->foreign('fuente_finan_id')->references('id')->on('catalogo_fuente_financiamiento')->onUpdate('cascade');
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
            $table->dropForeign(['fuente_finan_id']);
            $table->dropColumn('fuente_finan_id');
        });
    }
}
