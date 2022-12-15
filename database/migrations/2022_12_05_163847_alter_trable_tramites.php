<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTrableTramites extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rel_trabajador_adscripcion', function (Blueprint $table) {
            $table->smallInteger('user_id')->after("activo");
            $table->smallInteger('reingenieria')->after("fecha_oficio");

            $table->string("estatus",2)->comments("P = Pendiente, A = Realizado, C=Cancelado, I=Interrumpido")->after("user_id")->default("P");
            $table->Integer("user_deleted_id")->after("user_id")->nullable();
            $table->Integer("user_updated_id")->after("user_id")->nullable();
            $table->string("cr_before_id",15)->after("user_id")->nullable();
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('rel_trabajador_adscripcion', function (Blueprint $table) {
            $table->dropColumn("user_deleted_id");
            $table->dropColumn("user_updated_id");
            $table->dropColumn("cr_before_id");
            $table->dropColumn("estatus");
            $table->dropColumn("user_id");
            $table->dropColumn("reingenieria");
            
        });
    }
}
