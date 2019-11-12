<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterPermutaAdscripcionHacerNullabelCrOrigenDestino extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('permuta_adscripcion', function (Blueprint $table) {
            $table->string('cr_origen_id', 15)->after('clues_origen')->nullable()->change();
            $table->string('cr_destino_id', 15)->after('clues_destino')->nullable()->change();
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
            $table->string('cr_origen_id', 15)->after('clues_origen')->change();
            $table->string('cr_destino_id', 15)->after('clues_destino')->change();
        });
    }
}
