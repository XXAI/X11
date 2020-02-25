<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableDashboardDetalle extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dashboard_elementos', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('dashboard_id')->unsigned();
            $table->smallInteger('orden');
            $table->string('tipo')->comment('Tipo de elemento: data, list, chart, table');
            $table->smallInteger('colspan')->nullable();
            $table->smallInteger('rowspan')->nullable();
            $table->string('icono')->nullable();
            $table->string('titulo')->nullable();
            $table->string('subtitulo')->nullable();
            $table->text('query')->nullable();
            $table->boolean('divisor')->nullable();
            $table->string('tipo_grafica')->nullable();
            $table->string('tipo_serie')->nullable();
            $table->string('categorias')->nullable();
            $table->string('series')->nullable();
            $table->smallInteger('alto')->nullable();
            $table->smallInteger('ancho')->nullable();
            $table->boolean('visible');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('dashboard_id')->references('id')->on('dashboard')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('dashboard_elementos');
    }
}
