<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTableCatCrResponsable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('catalogo_cr', function (Blueprint $table) {
            $table->string('municipio', 255)->after('descripcion_actualizada');
            $table->string('cargo_responsable', 255)->after('descripcion_actualizada');
            $table->string('nombre_responsable', 255)->after('descripcion_actualizada');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('trabajador', function (Blueprint $table) {
            $table->dropColumn('municipio');
            $table->dropColumn('cargo_responsable');
            $table->dropColumn('nombre_responsable');
        });
    }
}
