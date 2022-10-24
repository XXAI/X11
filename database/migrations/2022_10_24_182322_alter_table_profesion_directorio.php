<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTableProfesionDirectorio extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rel_trabajador_cr_responsables', function (Blueprint $table) {
            $table->string("profesion",50)->comments("DRA. ING.")->after("tipo_responsable_id");

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('rel_trabajador_cr_responsables', function (Blueprint $table) {
            $table->dropColumn("profesion"); 
        });
    }
}
