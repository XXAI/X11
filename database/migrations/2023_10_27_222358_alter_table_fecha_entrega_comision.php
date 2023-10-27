<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTableFechaEntregaComision extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rel_trabajador_comision_interna', function (Blueprint $table) {
            $table->date('fecha_inicio')->nullable()->change();
            $table->date('fecha_fin')->nullable()->change();
            $table->smallInteger('fecha_recepcion')->default(0)->after("cr_destino");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('rel_trabajador_comision_interna', function (Blueprint $table) {
            $table->dropColumn("fecha_recepcion");
            $table->date('fecha_inicio')->change();
            $table->date('fecha_fin')->change();
        });
    }
}
