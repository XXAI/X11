<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableExpediente extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rel_trabajador_expediente', function (Blueprint $table) {
            $table->smallIncrements("id")->unsigned();
            $table->string("no_vale", "100");
            $table->date("fecha_prestamo");
            $table->string("trabajador_prestamista");
            $table->mediumInteger("trabajador_prestador_id")->unsigned();
            $table->mediumInteger("trabajador_devolvio_id")->unsigned();
            $table->date("fecha_devolucion")->nullable();
            $table->mediumInteger("trabajador_elimino_id")->unsigned();
            $table->date("fecha_elimino")->nullable();
            $table->mediumInteger("trabajador_id")->unsigned();
            $table->string("area_prestamista",250);
            $table->string("observaciones", 255);
            $table->smallInteger("estatus")->unsigned()->default(1)->comments("1=> activo, 2=>devuelto");
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('trabajador', function (Blueprint $table) {
            $table->string('no_expediente',100)->after("nivel_maximo_id");
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
            $table->dropColumn('no_expediente');
        });
        Schema::dropIfExists('rel_trabajador_expediente');
    }
}
