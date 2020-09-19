<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRelTrabajadorNomina extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rel_trabajador_nomina', function (Blueprint $table) {
            $table->Increments('id')->unsigned();
            $table->smallInteger('trabajador_id')->unsigned();
            $table->decimal('sueldo_mensual', 15,2)->default(0);
            $table->decimal('compensacion', 15,2)->default(0);
            $table->decimal('prestaciones_ley', 15,2)->default(0);
            $table->decimal('prestaciones_cgt', 15,2)->default(0);
            $table->decimal('estimulos', 15,2)->default(0);
            $table->decimal('remuneracion_mensual', 15,2)->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rel_trabajador_nomina');
    }
}
