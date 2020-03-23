<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableSinerhiasCursosPostecnicoEnfermeria extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sinerhias_cursos_postecnico_enfermeria', function (Blueprint $table) {
            $table->integer('id')->unsigned();
            $table->string('descripcion', 256);
            $table->timestamps();
            $table->softDeletes();

            $table->primary('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sinerhias_cursos_postecnico_enfermeria');
    }
}
