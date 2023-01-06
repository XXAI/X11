<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterFolioTramites extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rel_trabajador_adscripcion', function (Blueprint $table) {
            $table->smallInteger('folio')->unsigned()->change();
        });
        Schema::table('rel_trabajador_comision_interna', function (Blueprint $table) {
            $table->smallInteger('folio')->unsigned()->change();
        });
        Schema::table('rel_trabajador_comision_gerencial', function (Blueprint $table) {
            $table->smallInteger('folio')->unsigned()->change();
        });
        Schema::table('rel_trabajador_reincorporacion', function (Blueprint $table) {
            $table->smallInteger('folio')->unsigned()->change();
        });
        Schema::table('importar_tramites', function (Blueprint $table) {
            $table->smallInteger('folio')->unsigned()->change();
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
            $table->smallInteger('folio')->unsigned()->change();
        });
        Schema::table('rel_trabajador_comision_interna', function (Blueprint $table) {
            $table->smallInteger('folio')->unsigned()->change();
        });
        Schema::table('rel_trabajador_comision_gerencial', function (Blueprint $table) {
            $table->smallInteger('folio')->unsigned()->change();
        });
        Schema::table('rel_trabajador_reincorporacion', function (Blueprint $table) {
            $table->smallInteger('folio')->unsigned()->change();
        });
        Schema::table('importar_tramites', function (Blueprint $table) {
            $table->smallInteger('folio')->unsigned()->change();
        });
    }
}
