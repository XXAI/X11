<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableOpd extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('opd', function (Blueprint $table) {
            $table->id();
            $table->string("clues",14);
            $table->string("municipio",50);
            $table->string("localidad",50);
            $table->smallInteger("jurisdiccion_id")->unsigned();
            $table->string("nivel_atencion",100);
            $table->string("tipo_establecimiento",100);
            $table->string("nombre_unidad",300);
            $table->string("vialidad",100);
            $table->string("tipologia",100);
            $table->string("responsable",200);
            $table->smallInteger("impresion_anexo_1_2")->unsigned()->default(0);
            $table->dateTime("fecha_impresion_anexo_1_2");
            $table->smallInteger("impresion_anexo_3")->unsigned()->default(0);
            $table->dateTime("fecha_impresion_anexo_3");
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
        Schema::dropIfExists('opd');
    }
}
