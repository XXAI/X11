<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableCluesEmpleado extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clues_empleado', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('clues',14);
            $table->unsignedSmallInteger('empleado_id');
            $table->date('fecha_inicio');
            $table->date('fecha_fin')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('empleado_id')->references('id')->on('empleados');
            $table->foreign('clues')->references('clues')->on('catalogo_clues');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('clues_empleado');
    }
}
