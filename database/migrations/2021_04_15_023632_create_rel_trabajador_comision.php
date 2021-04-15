<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRelTrabajadorComision extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rel_trabajador_comision', function (Blueprint $table) {
            $table->Increments('id')->unsigned();
            $table->smallInteger('trabajador_id')->unsigned();
            $table->string('tipo_comision_id', 2);
            $table->smallInteger('sindicato_id')->unsigned();
            $table->date('fecha_inicio');
            $table->date('fecha_fin');
            $table->string('no_oficio', 250);
            $table->string('estatus', 1);
            
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
        Schema::dropIfExists('rel_trabajador_comision');
    }
}
