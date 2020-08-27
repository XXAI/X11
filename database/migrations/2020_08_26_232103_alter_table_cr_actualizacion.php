<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableCrActualizacion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('catalogo_cr', function (Blueprint $table) {
            $table->string('descripcion_actualizada')->nullable()->after('area');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('catalogo_cr', function (Blueprint $table) {
            $table->dropColumn('descripcion_actualizada');
        });
    }
}
