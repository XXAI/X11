<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableComisionDetalle extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('comision_detalle', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->bigInteger('comision_empleado_id')->unsigned();
            $table->date('fecha_inicio');
            $table->date('fecha_fin')->nullable();
            $table->string('no_oficio',200)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('comision_empleado_id')
                ->references('id')->on('comision_empleado')
                ->onUpdate('cascade');
        });

        Schema::table('comision_empleado', function (Blueprint $table) {
            $table->bigInteger('comision_detalle_id')->unsigned()->nullable()->after('cr');
            $table->foreign('comision_detalle_id')
                ->references('id')->on('comision_detalle')
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
        Schema::table('comision_empleado', function (Blueprint $table) {
            $table->dropForeign(['comision_detalle_id']);
            $table->dropColumn('comision_detalle_id');
        });

        Schema::dropIfExists('comision_detalle');
    }
}
