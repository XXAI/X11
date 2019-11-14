<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterEmpleadosAgregarTurnoId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('empleados', function (Blueprint $table) {
            $table->unsignedSmallInteger('turno_id')->after('horario')->nullable();
            $table->string('horario')->nullable()->change();
            $table->date('fissa')->nullable()->change();
            $table->date('figf')->nullable()->change();

            $table->foreign('turno_id')->references('id')->on('catalogo_turno');
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
            $table->string('horario', 150)->change();
            $table->dropColumn('turno_id');
        });
    }
}
