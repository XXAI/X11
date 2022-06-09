<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTableComisionInternaSindical extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('rel_trabajador_comision', function (Blueprint $table) {
            $table->string("comision_sindical_interna")->comments("A = Activo, I = Inactivo")->after("estatus")->nullable();
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('rel_trabajador_comision', function (Blueprint $table) {
            $table->dropColumn('comision_sindical_interna');
        });
    }
}
