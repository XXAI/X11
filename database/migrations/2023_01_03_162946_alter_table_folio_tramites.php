<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTableFolioTramites extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rel_trabajador_adscripcion', function (Blueprint $table) {
            $table->string('folio',10)->after("trabajador_id");
        });
        
        Schema::table('rel_trabajador_comision_interna', function (Blueprint $table) {
            $table->string('folio',10)->after("trabajador_id");
        });
        Schema::table('rel_trabajador_comision_gerencial', function (Blueprint $table) {
            $table->string('folio',10)->after("trabajador_id");
        });
        Schema::table('rel_trabajador_reincorporacion', function (Blueprint $table) {
            $table->string('folio',10)->after("trabajador_id");
            $table->date('fecha_cambio')->after("fecha_oficio");
        });
        Schema::table('importar_tramites', function (Blueprint $table) {
            $table->string('folio',10)->after("trabajador_id");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('rel_trabajador_adscripcion', function (Blueprint $table) {
            $table->dropColumn("folio");
        });
        Schema::table('rel_trabajador_comision_interna', function (Blueprint $table) {
            $table->dropColumn("folio");
        });
        Schema::table('rel_trabajador_comision_gerencial', function (Blueprint $table) {
            $table->dropColumn("folio");
            
        });
        Schema::table('rel_trabajador_reincorporacion', function (Blueprint $table) {
            $table->dropColumn("folio");
            $table->dropColumn("fecha_cambio");
        });
        Schema::table('importar_tramites', function (Blueprint $table) {
            $table->dropColumn("folio");
        });
    }
}
