<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterEmpleadosAgregarCamposExtras extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('empleados', function (Blueprint $table) {
            $table->dropForeign(['comision_sindical_id']);
        });

        Schema::table('catalogo_sindicato', function (Blueprint $table) {
            $table->smallIncrements('id')->unsigned()->change();
        });

        Schema::table('empleados', function (Blueprint $table) {
            $table->smallInteger('comision_sindical_id')->unsigned()->nullable()->change();

            $table->smallInteger('sindicato_id')->unsigned()->nullable()->after('comision_sindical_id');
            $table->smallInteger('tipo_trabajador_id')->unsigned()->nullable()->after('tipo_nomina_id');

            $table->boolean('activo')->after('estatus')->default(false);
            $table->string('tipo_comision',2)->after('validado')->nullable()->comment('CI = Comision Interna, CS = Comision Sindical');
            $table->string('detalle_estatus',3)->after('tipo_comision')->nullable()->comment('N = Normal, L = Licencia, B = Baja');

            $table->foreign('tipo_trabajador_id')
                ->references('id')->on('catalogo_tipo_trabajador')
                ->onUpdate('cascade');

            $table->foreign('sindicato_id')
                ->references('id')->on('catalogo_sindicato')
                ->onUpdate('cascade');
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
            $table->foreign('comision_sindical_id')
                ->references('id')->on('catalogo_sindicato')
                ->onUpdate('cascade');

            $table->dropForeign(['tipo_trabajador_id']);
            $table->dropColumn('tipo_trabajador_id');

            $table->dropForeign(['sindicato_id']);
            $table->dropColumn('sindicato_id');

            $table->dropColumn('activo');
            $table->dropColumn('tipo_comision');
            $table->dropColumn('detalle_estatus');
        });
    }
}
