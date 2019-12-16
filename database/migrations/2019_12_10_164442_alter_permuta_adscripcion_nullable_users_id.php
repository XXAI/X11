<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterPermutaAdscripcionNullableUsersId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('permuta_adscripcion', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->smallinteger('user_origen_id')->unsigned()->nullable()->change();
            $table->smallinteger('user_destino_id')->unsigned()->nullable()->change();
            $table->dropColumn('user_id');
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
            $table->smallinteger('user_origen_id')->unsigned()->change();
            $table->smallinteger('user_destino_id')->unsigned()->change();
            $table->smallinteger('user_id')->after('estatus')->unsigned();
            
            $table->foreign('user_id')
                ->references('id')->on('users')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }
}
