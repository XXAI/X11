<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableCatalogoMunicipioNacimiento extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('table_catalogo_municipio_nacimiento', function (Blueprint $table) {
            $table->smallIncrements('id')->unsigned();
            $table->smallInteger('entidad_id')->unsigned();
            $table->string('descripcion', 256);
            $table->smallInteger('clave_sinergias')->unsigned();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('entidad_id')
                ->references('id')->on('catalogo_entidad_nacimiento')
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
        Schema::dropIfExists('table_catalogo_municipio_nacimiento');
    }
}
