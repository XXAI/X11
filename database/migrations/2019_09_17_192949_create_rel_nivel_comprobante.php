<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRelNivelComprobante extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rel_nivel_comprobante', function (Blueprint $table) {
            $table->mediuminteger('id')->unsigned();
            $table->tinyinteger('comprobante_id')->unsigned();
            $table->tinyinteger('nivel_academico_id')->unsigned();

			$table->foreign('comprobante_id')
                  ->references('id')->on('catalogo_comprobante')
                  ->onUpdate('cascade')
                  ->onDelete('cascade');

            $table->foreign('nivel_academico_id')
                  ->references('id')->on('catalogo_nivel_academico')
                  ->onUpdate('cascade')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rel_nivel_comprobante');
    }
}
