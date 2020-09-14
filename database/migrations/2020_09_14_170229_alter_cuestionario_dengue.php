<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterCuestionarioDengue extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('participante', function (Blueprint $table) {
            $table->smallinteger('video6')->default(0)->unsigned()->after('video4');
            $table->smallinteger('video5')->default(0)->unsigned()->after('video4');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('participante', function (Blueprint $table) {
            $table->dropColumn('video6');
            $table->dropColumn('video5');
        });
    }
}
