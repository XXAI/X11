<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableComisionEmpleado extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('comision_empleado', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedSmallInteger('empleado_id');
            $table->string('tipo_comision',2)->comment('CI = Comision Interna, CS = Comision Sindical');
            $table->boolean('recurrente')->default(false);
            $table->smallInteger('total_acumulado_meses')->nullable();

            $table->string('clues', 14)->nullable();
            $table->string('cr', 15)->nullable();

            $table->string('estatus',3)->comment('A = Activo, V = Vencido, H = Historico');

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('empleado_id')->references('id')->on('empleados')->onUpdate('cascade');
        });

        Schema::table('empleados', function (Blueprint $table) {
            $table->bigInteger('ultima_comision_id')->unsigned()->nullable()->after('tipo_comision');
            $table->foreign('ultima_comision_id')
                ->references('id')->on('comision_empleado')
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
            $table->dropForeign(['ultima_comision_id']);
            $table->dropColumn('ultima_comision_id');
        });

        Schema::dropIfExists('comision_empleado');
    }
}
