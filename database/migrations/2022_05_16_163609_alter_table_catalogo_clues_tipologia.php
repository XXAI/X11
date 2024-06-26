<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTableCatalogoCluesTipologia extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('catalogo_clues', function (Blueprint $table) {
            $table->string("clasificacion", 100)->after("cargo_responsable");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('catalogo_clues', function (Blueprint $table) {
            $table->dropColumn('clasificacion');
        });
    }
}
