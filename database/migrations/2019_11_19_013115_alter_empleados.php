<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterEmpleados extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('empleados', function (Blueprint $table) {
            $table->string('cr_adscripcion_id', 15)->nullable()->after('cr_id');
            $table->string('clues_adscripcion', 14)->nullable()->after('clues');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('empleados', function (Blueprint $table) {
            
            $table->dropColumn('cr_adscripcion_id');
            $table->dropColumn('clues_adscripcion');
            
        });
    }
}
