<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCatalogoTiempoTolerancia extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('catalogo_tiempo_tolerancia', function (Blueprint $table) {
            $table->smallIncrements('id')->unsigned();
            $table->string('descripcion');
            $table->smallInteger('tiempo')->comments("En minutos");
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
        Schema::dropIfExists('catalogo_tiempo_tolerancia');
    }
}
