<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableCatalogoActividad extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('table_catalogo_actividad', function (Blueprint $table) {
            $table->smallIncrements('id')->unsigned();
            $table->string('descripcion', 256);
            $table->smallInteger('clave_sinergias')->unsigned();
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
        Schema::dropIfExists('table_catalogo_actividad');
    }
}
