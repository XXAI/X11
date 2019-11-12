<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterCluesEmpleadoAgregarCr extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('clues_empleado', function (Blueprint $table) {
            $table->string('cr', 15)->after('clues')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('clues_empleado', function (Blueprint $table) {
            $table->dropColumn('cr');
        });
    }
}
