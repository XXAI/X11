<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTrableTrabajadorLastUpdate extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('trabajador', function (Blueprint $table) {
            $table->smallInteger('user_last_update')->nullable()->unsigned()->after('nivel_maximo_id');
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
            $table->dropColumn('user_last_update');
        });
    }
}
