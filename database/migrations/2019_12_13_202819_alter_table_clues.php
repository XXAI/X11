<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterTableClues extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('catalogo_clues', function (Blueprint $table) {
            $table->string('cargo_responsable')->nullable()->after("estatus_acreditacion");
            $table->smallinteger('responsable_id')->unsigned()->nullable()->after("estatus_acreditacion");
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
            $table->dropColumn('responsable_id');
            $table->dropColumn('cargo_responsable');
        });
    }
}
