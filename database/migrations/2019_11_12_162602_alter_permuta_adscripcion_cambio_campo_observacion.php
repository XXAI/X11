<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterPermutaAdscripcionCambioCampoObservacion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('permuta_adscripcion', function (Blueprint $table) {
            $table->text('observacion')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('permuta_adscripcion', function (Blueprint $table) {
            $table->text('observacion')->change();
        });
    }
}
