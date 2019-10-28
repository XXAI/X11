<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableCatalogoClues extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('catalogo_clues', function (Blueprint $table) {
            $table->string('clues', 14)->primary()->index();
            $table->string('cve_jurisdiccion', 2);
            $table->string('nombre_unidad', 256)->index();
            $table->string('estatus', 100);
            $table->unsignedTinyInteger('clave_estatus')->unsigned();
            $table->string('longitud',50);
            $table->string('latitud',50);
            $table->string('nivel_atencion',255);
            $table->unsignedTinyInteger('clave_nivel')->unsigned();
            $table->string('estatus_acreditacion', 100);
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
        Schema::dropIfExists('catalogo_clues');
    }
}
