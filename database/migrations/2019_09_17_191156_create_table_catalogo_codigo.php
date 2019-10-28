<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableCatalogoCodigo extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('catalogo_codigo', function (Blueprint $table) {
            $table->string('codigo', 10)->primary()->index();
            $table->string('descripcion', 150);
            $table->unsignedTinyInteger('tabulador_id');
            
            $table->boolean('secundaria')->default(0);
            $table->boolean('preparatoria')->default(0);
            $table->boolean('tecnica')->default(0);
            $table->boolean('carrera')->default(0);
            $table->boolean('titulo')->default(0);
            $table->boolean('maestria')->default(0);
            $table->boolean('doctorado')->default(0);
            $table->boolean('cursos')->default(0);
            $table->boolean('especialidad')->default(0);
            $table->boolean('diplomado')->default(0);
            $table->boolean('poliglota')->default(0);
            
            $table->timestamps();
            $table->softDeletes();
   
            $table->foreign('tabulador_id')
                  ->references('id')->on('catalogo_tabulador')
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
        Schema::dropIfExists('catalogo_codigo');
    }
}
