<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTableRelDocumentacionEstatus extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rel_trabajador_documentacion', function (Blueprint $table) {
            $table->date("fecha_respuesta")->after("estatus")->nullable();
            $table->smallInteger("user_respuesta")->after("estatus")->nullable();
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('rel_trabajador_documentacion', function (Blueprint $table) {
            $table->dropColumn('user_respuesta');
            $table->dropColumn('fecha_respuesta');
        });
    }
}
