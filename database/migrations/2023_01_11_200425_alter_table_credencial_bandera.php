<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTableCredencialBandera extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rel_trabajador_credencial', function (Blueprint $table) {
            $table->date('fecha_impresion')->after("extension")->nullable();
            $table->mediumInteger('user_impresion_id')->after("extension")->nullable();
            $table->smallInteger('impreso')->after("extension")->default(0);
        });

        Schema::table('catalogo_clues', function (Blueprint $table) {
            $table->string('clasificacion_descripcion', 250)->after("clasificacion");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('rel_trabajador_credencial', function (Blueprint $table) {
            $table->dropColumn("fecha_impresion");
            $table->dropColumn("user_impresion_id");
            $table->dropColumn("impreso");
        });
        
        Schema::table('catalogo_clues', function (Blueprint $table) {
            $table->dropColumn('clasificacion_descripcion');
        });
    }
}
