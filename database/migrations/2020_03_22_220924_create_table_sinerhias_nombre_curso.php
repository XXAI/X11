<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableSinerhiasNombreCurso extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sinerhias_nombre_curso', function (Blueprint $table) {
            $table->integer('id')->unsigned();
            $table->integer('entidad_id')->unsigned();
            $table->string('descripcion', 256);


            $table->timestamps();
            $table->softDeletes();

            $table->primary('id');

            $table->foreign('entidad_id')
                ->references('id')->on('sinerhias_entidad')
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
        Schema::dropIfExists('sinerhias_nombre_curso');
    }
}
