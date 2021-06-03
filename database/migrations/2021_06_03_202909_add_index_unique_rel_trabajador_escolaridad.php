<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIndexUniqueRelTrabajadorEscolaridad extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rel_trabajador_escolaridad', function (Blueprint $table) {
            $table->unique('no_cedula');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('rel_trabajador_escolaridad', function (Blueprint $table) {
            $table->dropUnique(['no_cedula']);
        });
    }
}
